import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });

test("combined text/status/priority/owner queries filter before counting and paging 60 tasks", async () => {
  const { db, close } = await createTestDb(); cleanup.push(close);
  const a = await seedUser(db); const b = await seedUser(db);
  for (let i = 0; i < 60; i++) await db.task.create({ data: { ownerId: i < 55 ? a.actor.id : b.actor.id, title: `Plan ${String(i).padStart(2, "0")}`, description: i % 2 ? "distinctive" : "", priority: i < 50 ? "HIGH" : "NORMAL", status: i < 45 ? "OPEN" : "DONE", createdAt: new Date(Date.UTC(2026, 9, 1, 0, i)) } });
  const { queryTasks, parseTaskQuery } = await import("@/server/tasks/query");
  const query = parseTaskQuery(new URLSearchParams({ q: "Plan", status: "OPEN", priority: "HIGH", ownerId: a.actor.id, sort: "created_asc", page: "2" }));
  const result = await queryTasks(db, query);
  expect(result).toMatchObject({ total: 45, page: 2, pageSize: 25 }); expect(result.items).toHaveLength(20);
  expect(result.items[0].title).toBe("Plan 25"); expect(result.items[19].title).toBe("Plan 44");
  expect(Object.keys(result.items[0].owner).sort()).toEqual(["displayName", "id"]);
  expect((await queryTasks(db, { q: "distinctive", sort: "title_asc", page: 1 })).total).toBe(30);
  expect((await queryTasks(db, { q: "' OR 1=1 --", page: 1, sort: "created_desc" })).total).toBe(0);
  expect((await queryTasks(db, { page: 100000, sort: "created_desc" })).items).toEqual([]);
});

test("query parsing rejects repeated/unknown parameters and invalid boundaries", async () => {
  const { parseTaskQuery } = await import("@/server/tasks/query");
  expect(parseTaskQuery({})).toEqual({ sort: "created_desc", page: 1 });
  for (const bad of [{ q: "x".repeat(101) }, { page: "0" }, { page: "1.5" }, { page: "100001" }, { sort: "DROP TABLE" }, { status: "missing" }, { ownerId: "bad" }, { injected: "1" }, { q: ["a", "b"] }, new URLSearchParams("page=1&page=2")]) {
    expect(() => parseTaskQuery(bad)).toThrowError(expect.objectContaining({ code: "VALIDATION" }));
  }
});

test("all four sorts tie-break deterministically and export reads all matches", async () => {
  const { db, close } = await createTestDb(); cleanup.push(close); const user = await seedUser(db);
  const stamp = new Date("2026-10-20T00:00:00Z");
  for (let i = 0; i < 30; i++) await db.task.create({ data: { ownerId: user.actor.id, title: "Same", createdAt: stamp, updatedAt: stamp } });
  const { queryTasks, readAllTasks } = await import("@/server/tasks/query");
  for (const sort of ["created_desc", "created_asc", "updated_desc", "title_asc"]) {
    const first = await queryTasks(db, { sort, page: 1 }); const second = await queryTasks(db, { sort, page: 2 });
    expect(new Set([...first.items, ...second.items].map((task) => task.id)).size).toBe(30);
    expect((await queryTasks(db, { sort, page: 1 })).items.map((task) => task.id)).toEqual(first.items.map((task) => task.id));
  }
  expect(await readAllTasks(db, { sort: "created_desc", page: 2 })).toHaveLength(30);
});
