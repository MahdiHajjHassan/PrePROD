import { afterEach, expect, test } from "vitest";
import { verify } from "@node-rs/argon2";
import { createTestDb } from "../helpers/db";

const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
async function fixture(migrate = true) { const value = await createTestDb({ migrate }); cleanup.push(value.close); return value; }
const seedInput = { adminEmail: "admin@taskboard.local", adminPassword: "local-seed-password-42", apiActorEmail: "api@taskboard.local" };

test("readiness fails when the database exists without its migrations", async () => {
  const { db } = await fixture(false);
  const { readiness } = await import("@/server/readiness");
  await expect(readiness(db)).rejects.toThrow("migrations");
});

test("migrated database is ready without exposing credentials", async () => {
  const { db } = await fixture();
  const { readiness } = await import("@/server/readiness");
  await expect(readiness(db)).resolves.toEqual({ status: "ok", database: "ok" });
});

test("first bootstrap creates the supplied admin and an API member with hashed passwords", async () => {
  const { db } = await fixture();
  const { seedDatabase } = await import("@/server/seed");
  await expect(seedDatabase(db, seedInput)).resolves.toEqual({ created: true });
  const admin = await db.user.findUniqueOrThrow({ where: { email: seedInput.adminEmail } });
  const api = await db.user.findUniqueOrThrow({ where: { email: seedInput.apiActorEmail } });
  expect(admin.role).toBe("ADMIN"); expect(api.role).toBe("MEMBER");
  expect(admin.passwordHash).not.toBe(seedInput.adminPassword);
  expect(admin.passwordHash).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
  expect(await verify(admin.passwordHash, seedInput.adminPassword)).toBe(true);
  expect(await verify(api.passwordHash, seedInput.adminPassword)).toBe(false);
});

test("restarting preserves edited credentials and does not resurrect a deleted API actor", async () => {
  const { db, url } = await fixture();
  const { seedDatabase } = await import("@/server/seed");
  await seedDatabase(db, seedInput);
  const before = await db.user.findUniqueOrThrow({ where: { email: seedInput.adminEmail } });
  await db.user.update({ where: { id: before.id }, data: { displayName: "Preserved name" } });
  await db.user.delete({ where: { email: seedInput.apiActorEmail } });
  await db.$disconnect();
  const { createDb } = await import("@/server/db");
  const reopened = await createDb(url); cleanup.push(() => reopened.$disconnect());
  await expect(seedDatabase(reopened, { ...seedInput, adminPassword: "another-password-42" })).resolves.toEqual({ created: false });
  const after = await reopened.user.findUniqueOrThrow({ where: { id: before.id } });
  expect(after.displayName).toBe("Preserved name"); expect(after.passwordHash).toBe(before.passwordHash);
  expect(await reopened.user.count()).toBe(1);
});

test("foreign keys remove only the deleted user's sessions and tasks", async () => {
  const { db } = await fixture();
  const a = await db.user.create({ data: { email: "a@example.test", displayName: "A", passwordHash: "test-only-not-a-real-password" } });
  const b = await db.user.create({ data: { email: "b@example.test", displayName: "B", passwordHash: "test-only-not-a-real-password" } });
  await db.session.create({ data: { id: "f".repeat(64), userId: a.id, expiresAt: new Date(Date.now() + 60000) } });
  await db.task.create({ data: { title: "A task", ownerId: a.id } });
  await db.task.create({ data: { title: "B task", ownerId: b.id } });
  await db.user.delete({ where: { id: a.id } });
  expect(await db.session.count()).toBe(0);
  expect((await db.task.findMany()).map((task) => task.title)).toEqual(["B task"]);
});
