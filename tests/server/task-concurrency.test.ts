import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";

const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
async function fixture() {
  const { db, url, close } = await createTestDb(); cleanup.push(close);
  const { createDb } = await import("@/server/db");
  const second = await createDb(url); cleanup.push(() => second.$disconnect());
  const { createTaskService } = await import("@/server/tasks/service");
  const user = await seedUser(db);
  return { db, first: createTaskService(db), second: createTaskService(second), actor: user.actor };
}

test("independent DB connections accept exactly one update using the same old revision", async () => {
  const { first, second, actor } = await fixture();
  const task = await first.create(actor, { title: "Original" });
  const results = await Promise.allSettled([
    first.update(actor, task.id, { title: "First" }, 1), second.update(actor, task.id, { title: "Second" }, 1),
  ]);
  expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
  const rejected = results.find((result) => result.status === "rejected");
  expect(rejected?.status === "rejected" ? rejected.reason : null).toMatchObject({ code: "CONFLICT" });
  expect((await first.read(task.id)).version).toBe(2);
});

test("independent DB connections preserve simultaneous task creations from different users", async () => {
  const { db, first, second, actor } = await fixture();
  const b = await seedUser(db);
  const [aTask, bTask] = await Promise.all([first.create(actor, { title: "A" }), second.create(b.actor, { title: "B" })]);
  expect(aTask.owner.id).toBe(actor.id);
  expect(bTask.owner.id).toBe(b.actor.id);
  expect(await db.task.count()).toBe(2);
});
