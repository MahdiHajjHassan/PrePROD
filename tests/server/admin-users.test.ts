import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
async function fixture() {
  const { db, url, close } = await createTestDb(); cleanup.push(close);
  const { createUserService } = await import("@/server/users/service");
  const admin = await seedUser(db, { role: "ADMIN" }); const member = await seedUser(db);
  return { db, url, users: createUserService(db), admin: admin.actor, member: member.actor };
}
test("admin can list/update roles; member and forged/demoted admin are forbidden", async () => {
  const { db, users, admin, member } = await fixture();
  await expect(users.listUsers(member)).rejects.toMatchObject({ code: "FORBIDDEN" });
  await expect(users.updateUser({ ...member, role: "ADMIN" }, member.id, { role: "ADMIN" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  const result = await users.listUsers(admin);
  expect(result.total).toBe(2); expect(result.items[0]).not.toHaveProperty("passwordHash");
  expect(await users.updateUser(admin, member.id, { role: "ADMIN", displayName: "Promoted" })).toMatchObject({ role: "ADMIN", displayName: "Promoted" });
  await db.user.update({ where: { id: admin.id }, data: { role: "MEMBER" } });
  await expect(users.listUsers(admin)).rejects.toMatchObject({ code: "FORBIDDEN" });
});
test("last admin cannot be deleted/demoted and privileged or empty patches are rejected", async () => {
  const { db, users, admin } = await fixture();
  await expect(users.deleteUser(admin, admin.id)).rejects.toMatchObject({ code: "CONFLICT" });
  await expect(users.updateUser(admin, admin.id, { role: "MEMBER" })).rejects.toMatchObject({ code: "CONFLICT" });
  for (const patch of [{}, { email: "changed@example.test" }, { passwordHash: "forged" }, { displayName: " " }]) await expect(users.updateUser(admin, admin.id, patch)).rejects.toMatchObject({ code: "VALIDATION" });
  expect(await db.user.count({ where: { role: "ADMIN" } })).toBe(1);
});
test("deleting a member atomically removes sessions/tasks and preserves other owners", async () => {
  const { db, users, admin, member } = await fixture();
  const { createSessionToken } = await import("@/server/auth/session");
  await createSessionToken(db, member.id, new Date());
  await db.task.create({ data: { title: "Delete", ownerId: member.id } });
  await db.task.create({ data: { title: "Keep", ownerId: admin.id } });
  await users.deleteUser(admin, member.id);
  expect(await db.session.count({ where: { userId: member.id } })).toBe(0);
  expect(await db.task.count({ where: { ownerId: member.id } })).toBe(0);
  expect(await db.task.count()).toBe(1);
});
test("competing administrators using separate connections cannot remove the final admin", async () => {
  const { db, url, users, admin } = await fixture(); const other = await seedUser(db, { role: "ADMIN" });
  const { createDb } = await import("@/server/db"); const secondDb = await createDb(url); cleanup.push(() => secondDb.$disconnect());
  const { createUserService } = await import("@/server/users/service"); const second = createUserService(secondDb);
  const outcomes = await Promise.allSettled([users.updateUser(admin, admin.id, { role: "MEMBER" }), second.deleteUser(other.actor, other.actor.id)]);
  expect(outcomes.filter((item) => item.status === "fulfilled")).toHaveLength(1);
  expect(await db.user.count({ where: { role: "ADMIN" } })).toBe(1);
});
