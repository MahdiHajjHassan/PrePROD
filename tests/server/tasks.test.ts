import { afterEach, expect, test } from "vitest";
import { randomUUID } from "node:crypto";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";

const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
async function fixture() {
  const { db, close } = await createTestDb(); cleanup.push(close);
  const { createTaskService } = await import("@/server/tasks/service");
  const a = await seedUser(db, { displayName: "Member A" });
  const b = await seedUser(db, { displayName: "Member B" });
  const admin = await seedUser(db, { role: "ADMIN", displayName: "Admin" });
  return { db, tasks: createTaskService(db), a: a.actor, b: b.actor, admin: admin.actor };
}

test("creation trims the title, applies defaults, and returns only public task/owner fields", async () => {
  const { db, tasks, a } = await fixture();
  const task = await tasks.create(a, { title: "  First task  " });
  expect(task).toMatchObject({ title: "First task", description: "", status: "OPEN", priority: "NORMAL", version: 1, owner: { id: a.id, displayName: "Member A" } });
  expect(Object.keys(task.owner).sort()).toEqual(["displayName", "id"]);
  expect(task).not.toHaveProperty("passwordHash");
  expect(task).not.toHaveProperty("email");
  expect(task.createdAt).toMatch(/T.*Z$/);
  expect(await db.task.count()).toBe(1);
  await expect(tasks.read(task.id)).resolves.toEqual(task);
});

test.each([
  { title: "  " }, { title: "x".repeat(121) }, { title: "Task", description: "x".repeat(1001) },
  { title: "Task", priority: "URGENT" }, { title: "Task", status: "ARCHIVED" },
  { title: "Task", ownerId: "another-owner" }, { title: "Task", role: "ADMIN" },
  { title: "Task", version: 99 },
])("invalid or privileged creation fields cannot create a task", async (input) => {
  const { db, tasks, a } = await fixture();
  await expect(tasks.create(a, input)).rejects.toMatchObject({ code: "VALIDATION" });
  expect(await db.task.count()).toBe(0);
});

test("partial updates preserve omitted values and increment the revision once", async () => {
  const { tasks, a } = await fixture();
  const original = await tasks.create(a, { title: "Task", description: "Keep this", priority: "HIGH", status: "DONE" });
  const changed = await tasks.update(a, original.id, { title: "Renamed" }, 1);
  expect(changed).toMatchObject({ id: original.id, title: "Renamed", description: "Keep this", priority: "HIGH", status: "DONE", version: 2, owner: original.owner });
});

test("members cannot mutate another owner's task, even with a forged admin role", async () => {
  const { tasks, a, b } = await fixture();
  const task = await tasks.create(a, { title: "Owned by A" });
  await expect(tasks.update(b, task.id, { status: "DONE" }, 1)).rejects.toMatchObject({ code: "FORBIDDEN" });
  await expect(tasks.remove(b, task.id, 1)).rejects.toMatchObject({ code: "FORBIDDEN" });
  await expect(tasks.update({ ...b, role: "ADMIN" }, task.id, { title: "Forged" }, 1)).rejects.toMatchObject({ code: "FORBIDDEN" });
  expect((await tasks.read(task.id)).version).toBe(1);
});

test("current administrators may edit others' tasks but a demoted actor loses that ability", async () => {
  const { db, tasks, a, admin } = await fixture();
  const task = await tasks.create(a, { title: "Member task" });
  expect((await tasks.update(admin, task.id, { status: "DONE" }, 1)).version).toBe(2);
  await db.user.update({ where: { id: admin.id }, data: { role: "MEMBER" } });
  await expect(tasks.remove(admin, task.id, 2)).rejects.toMatchObject({ code: "FORBIDDEN" });
});

test("stale updates and deletes leave the newer task untouched", async () => {
  const { tasks, a } = await fixture();
  const original = await tasks.create(a, { title: "Before" });
  await tasks.update(a, original.id, { title: "Newer" }, 1);
  await expect(tasks.update(a, original.id, { title: "Stale" }, 1)).rejects.toMatchObject({ code: "CONFLICT" });
  await expect(tasks.remove(a, original.id, 1)).rejects.toMatchObject({ code: "CONFLICT" });
  expect(await tasks.read(original.id)).toMatchObject({ title: "Newer", version: 2 });
  await tasks.remove(a, original.id, 2);
  await expect(tasks.read(original.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
});

test("empty/privileged patches and invalid revisions are rejected before mutation", async () => {
  const { tasks, a } = await fixture();
  const task = await tasks.create(a, { title: "Task" });
  for (const patch of [{}, { title: undefined }, { ownerId: a.id }, { role: "ADMIN" }, { version: 9 }]) {
    await expect(tasks.update(a, task.id, patch, 1)).rejects.toMatchObject({ code: "VALIDATION" });
  }
  for (const version of [0, -1, 1.5]) await expect(tasks.remove(a, task.id, version)).rejects.toMatchObject({ code: "VALIDATION" });
  expect((await tasks.read(task.id)).version).toBe(1);
});

test("anonymous or deleted actors cannot create tasks, and invalid/missing IDs are explicit", async () => {
  const { db, tasks, a } = await fixture();
  await expect(tasks.create(null, { title: "Anonymous" })).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  await db.user.delete({ where: { id: a.id } });
  await expect(tasks.create(a, { title: "Deleted actor" })).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  await expect(tasks.read("not-a-uuid")).rejects.toMatchObject({ code: "VALIDATION" });
  await expect(tasks.read(randomUUID())).rejects.toMatchObject({ code: "NOT_FOUND" });
});

test("public reads paginate deterministically and expose only public owner fields", async () => {
  const { db, tasks, a } = await fixture();
  for (let i = 0; i < 26; i++) await db.task.create({ data: { ownerId: a.id, title: `Task ${i}`, createdAt: new Date(Date.UTC(2026, 9, 27, 0, i)) } });
  const page = await tasks.list();
  expect(page).toMatchObject({ total: 26, page: 1, pageSize: 25 });
  expect(page.items).toHaveLength(25);
  expect(page.items[0].title).toBe("Task 25");
  expect(page.items[24].title).toBe("Task 1");
  expect(Object.keys(page.items[0].owner).sort()).toEqual(["displayName", "id"]);
  expect((await tasks.list({ page: 2, sort: "created_desc" })).items).toHaveLength(1);
});
