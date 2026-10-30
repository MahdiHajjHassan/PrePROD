import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
import { createSessionToken } from "@/backend/modules/auth/sessions.service";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => {
  for (const close of cleanup.splice(0)) await close();
});
test("operator email correction preserves role/password/games, revokes sessions, and requires proof again", async () => {
  const { db, close } = await createTestDb();
  cleanup.push(close);
  const user = await seedUser(db, { role: "ADMIN", email: "admin@tictactoe.local" });
  const before = await db.user.findUniqueOrThrow({ where: { id: user.actor.id } });
  const game = await db.game.create({ data: { mode: "AI", xId: user.actor.id, status: "ACTIVE" } });
  await createSessionToken(db, user.actor.id, new Date());
  const { setAccountEmail } = await import("@/backend/modules/auth/email/change-email");
  await setAccountEmail(db, " ADMIN@TICTACTOE.LOCAL ", " owner@example.test ");
  const after = await db.user.findUniqueOrThrow({ where: { id: user.actor.id } });
  expect(after).toMatchObject({
    id: before.id,
    role: "ADMIN",
    passwordHash: before.passwordHash,
    email: "owner@example.test",
    emailVerifiedAt: null,
  });
  expect(await db.session.count()).toBe(0);
  expect((await db.game.findUniqueOrThrow({ where: { id: game.id } })).xId).toBe(user.actor.id);
});
test("operator correction refuses another account's email without partial writes", async () => {
  const { db, close } = await createTestDb();
  cleanup.push(close);
  const user = await seedUser(db, { email: "one@example.test" });
  await seedUser(db, { email: "two@example.test" });
  const { setAccountEmail } = await import("@/backend/modules/auth/email/change-email");
  await expect(setAccountEmail(db, "one@example.test", "two@example.test")).rejects.toMatchObject({
    code: "CONFLICT",
  });
  expect((await db.user.findUniqueOrThrow({ where: { id: user.actor.id } })).email).toBe(
    "one@example.test",
  );
});
