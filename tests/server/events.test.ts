import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
async function fixture() {
  const { db, close } = await createTestDb(); cleanup.push(close);
  const admin = await seedUser(db, { role: "ADMIN" }); const member = await seedUser(db); const other = await seedUser(db);
  const { createTaskService } = await import("@/server/tasks/service");
  return { db, admin, member, other, tasks: createTaskService(db) };
}
test("successful task CRUD emits atomic events/notifications; failures emit none and completion means a transition", async () => {
  const { db, member, tasks } = await fixture();
  const task = await tasks.create(member.actor, { title: "Track this" });
  await tasks.update(member.actor, task.id, { status: "DONE" }, 1);
  await tasks.update(member.actor, task.id, { status: "DONE" }, 2);
  await expect(tasks.update(member.actor, task.id, { title: "Stale" }, 1)).rejects.toMatchObject({ code: "CONFLICT" });
  await tasks.remove(member.actor, task.id, 3);
  const events = await db.activityEvent.findMany({ orderBy: { createdAt: "asc" } });
  expect(events.map((event) => event.action)).toEqual(["CREATE", "UPDATE", "UPDATE", "DELETE"]);
  expect(events.filter((event) => event.completed)).toHaveLength(1);
  expect(await db.notification.count()).toBe(12);
  expect(await db.task.count()).toBe(0);
});
test("registration/login/account/password changes record safe events with account recipients", async () => {
  const { db, member } = await fixture();
  const { createAuthService } = await import("@/server/auth/service"); const auth = createAuthService(db);
  const user = await auth.register({ email: "new@example.test", displayName: "New", password: "registration-test-password" }, "new-client");
  expect(await db.notification.count()).toBe(2); // New user and the one admin.
  const login = await auth.login({ email: member.email, password: member.password }, "member-client");
  expect(await db.notification.count()).toBe(2); // Login is an event, not domain CRUD notification.
  await auth.updateAccount(member.actor, { displayName: "Changed" });
  await auth.changePassword(member.actor, { currentPassword: member.password, newPassword: "replacement-test-password" });
  const events = await db.activityEvent.findMany();
  expect(events).toHaveLength(4); expect(await db.notification.count()).toBe(6);
  const serialized = JSON.stringify(events);
  for (const sensitive of [member.password, login.token, "registration-test-password", "replacement-test-password", "passwordHash", "new@example.test"]) expect(serialized).not.toContain(sensitive);
  expect(events.find((event) => event.action === "CREATE")?.entityId).toBe(user.id);
});
test("import/public API/admin/cascade mutations use the same complete event matrix", async () => {
  const { db, admin, member, tasks } = await fixture();
  const { createTransferService } = await import("@/server/transfers/service");
  const bytes = new TextEncoder().encode(JSON.stringify([{ title: "Imported 1", description: "", status: "OPEN", priority: "NORMAL" }, { title: "Imported 2", description: "", status: "OPEN", priority: "NORMAL" }]));
  await createTransferService(db).import(member.actor, bytes, "json");
  expect(await db.activityEvent.count()).toBe(2);
  const { createUserService } = await import("@/server/users/service"); const users = createUserService(db);
  await users.updateUser(admin.actor, member.actor.id, { displayName: "Renamed" });
  const api = await seedUser(db, { email: "api-events@example.test" });
  const { createPublicApiHandlers } = await import("@/server/api/public");
  const key = "c".repeat(64); const handlers = createPublicApiHandlers(db, { publicApiKey: key, apiActorEmail: api.email });
  const response = await handlers.create(new Request("https://localhost/api/public/v1/tasks", { method: "POST", headers: { "X-API-Key": key, "Content-Type": "application/json" }, body: JSON.stringify({ title: "API event" }) }));
  expect(response.status).toBe(201);
  expect(await db.activityEvent.count({ where: { actorId: api.actor.id, entityType: "TASK", action: "CREATE" } })).toBe(1);
  await users.deleteUser(admin.actor, member.actor.id);
  expect(await db.activityEvent.count({ where: { entityType: "TASK", action: "DELETE" } })).toBe(2);
  expect(await db.activityEvent.count({ where: { entityType: "USER", action: "DELETE" } })).toBe(1);
  expect(await db.notification.count({ where: { recipientId: member.actor.id } })).toBe(0);
  const remaining = (await tasks.list()).items; expect(remaining).toHaveLength(1);
});
test("rolled back mutations and zero-recipient events leave no partial or recursive notifications", async () => {
  const { db, member } = await fixture();
  const { recordDomainEvent } = await import("@/server/activity/writer");
  await expect(db.$transaction(async (tx) => {
    const task = await tx.task.create({ data: { title: "Rollback", ownerId: member.actor.id } });
    await recordDomainEvent(tx, { actorId: member.actor.id, action: "CREATE", entityType: "TASK", entityId: task.id, label: task.title });
    throw new Error("Force rollback");
  })).rejects.toThrow("Force rollback");
  expect(await db.task.count()).toBe(0); expect(await db.activityEvent.count()).toBe(0); expect(await db.notification.count()).toBe(0);
  await db.$transaction((tx) => recordDomainEvent(tx, { actorId: member.actor.id, action: "LOGIN", entityType: "USER", entityId: member.actor.id, label: "Login" }));
  expect(await db.activityEvent.count()).toBe(1); expect(await db.notification.count()).toBe(0);
});
