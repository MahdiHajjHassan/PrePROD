import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
test("activity uses seven UTC calendar days, previous-period deltas, actor isolation, and retained deleted tasks", async () => {
  const { db, close } = await createTestDb(); cleanup.push(close); const user = await seedUser(db); const other = await seedUser(db);
  const { createActivityService } = await import("@/server/activity/service");
  const add = async (stamp: string, action: "CREATE" | "UPDATE" | "DELETE", actorId = user.actor.id, completed = false) => db.activityEvent.create({ data: { actorId, action, entityType: "TASK", entityId: "removed-task", label: "Historical", completed, createdAt: new Date(stamp) } });
  await add("2026-10-20T23:59:59Z", "CREATE"); // Previous period.
  await add("2026-10-21T00:00:00Z", "CREATE"); // Current start.
  await add("2026-10-27T23:59:59Z", "DELETE");
  await add("2026-10-24T10:00:00Z", "UPDATE", user.actor.id, true);
  await add("2026-10-24T11:00:00Z", "UPDATE", user.actor.id, true);
  await add("2026-10-24T12:00:00Z", "UPDATE", user.actor.id, false);
  await add("2026-10-28T00:00:00Z", "CREATE"); // Next day, excluded.
  await add("2026-10-22T10:00:00Z", "CREATE", other.actor.id);
  const summary = await createActivityService(db).getSummary(user.actor, new Date("2026-10-27T12:30:00Z"));
  expect(summary.current).toEqual({ created: 1, completed: 2, deleted: 1 });
  expect(summary.previous).toEqual({ created: 1, completed: 0, deleted: 0 });
  expect(summary.delta).toEqual({ created: 0, completed: 2, deleted: 1 });
  expect(summary.days).toHaveLength(7); expect(summary.days[0]).toMatchObject({ date: "2026-10-21", created: 1 });
  expect(summary.days[6]).toMatchObject({ date: "2026-10-27", deleted: 1 });
});
test("zero history is zero; repeated DONE edits count only transitions", async () => {
  const { db, close } = await createTestDb(); cleanup.push(close); const user = await seedUser(db);
  const { createActivityService } = await import("@/server/activity/service"); const activity = createActivityService(db);
  expect((await activity.getSummary(user.actor)).current).toEqual({ created: 0, completed: 0, deleted: 0 });
  const { createTaskService } = await import("@/server/tasks/service"); const tasks = createTaskService(db);
  const task = await tasks.create(user.actor, { title: "Cycles" });
  await tasks.update(user.actor, task.id, { status: "DONE" }, 1); await tasks.update(user.actor, task.id, { status: "DONE" }, 2);
  await tasks.update(user.actor, task.id, { status: "OPEN" }, 3); await tasks.update(user.actor, task.id, { status: "DONE" }, 4);
  await tasks.remove(user.actor, task.id, 5);
  expect((await activity.getSummary(user.actor)).current).toEqual({ created: 1, completed: 2, deleted: 1 });
});
