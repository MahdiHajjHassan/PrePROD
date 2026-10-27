import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
const key = "a".repeat(64);
async function fixture() {
  const { db, close } = await createTestDb(); cleanup.push(close);
  const api = await seedUser(db, { email: "api@example.test" }); const other = await seedUser(db);
  const { createPublicApiHandlers } = await import("@/server/api/public");
  return { db, api: api.actor, other: other.actor, handlers: createPublicApiHandlers(db, { publicApiKey: key, apiActorEmail: api.email }) };
}
function request(method = "GET", body?: unknown, apiKey: string | null = key, path = "/api/public/v1/tasks") {
  const headers = new Headers({ "Content-Type": "application/json", "X-Taskboard-Client-IP": "127.0.0.1" });
  if (apiKey !== null) headers.set("X-API-Key", apiKey);
  return new Request(`https://localhost${path}`, { method, headers, ...(method === "GET" ? {} : { body: JSON.stringify(body) }) });
}
test("all public operations authenticate before parsing input and expose no cookie/CORS credentials", async () => {
  const { handlers } = await fixture();
  for (const missing of [null, "wrong"]) {
    expect((await handlers.list(request("GET", undefined, missing))).status).toBe(401);
    expect((await handlers.read(request("GET", undefined, missing), "bad-id")).status).toBe(401);
    expect((await handlers.create(request("POST", {}, missing))).status).toBe(401);
    expect((await handlers.update(request("PUT", {}, missing), "bad-id")).status).toBe(401);
    expect((await handlers.remove(request("DELETE", {}, missing), "bad-id")).status).toBe(401);
  }
  const valid = await handlers.list(request()); expect(valid.status).toBe(200);
  expect(valid.headers.get("Set-Cookie")).toBeNull(); expect(valid.headers.get("Access-Control-Allow-Origin")).toBeNull();
});
test("secured API lifecycle enforces owner/version rules through shared services", async () => {
  const { handlers, db, other, api } = await fixture();
  const created = await handlers.create(request("POST", { title: "API task" })); expect(created.status).toBe(201);
  const task = (await created.json()).data; expect(task.owner.id).toBe(api.id);
  expect((await handlers.read(request(), task.id)).status).toBe(200);
  const updated = await handlers.update(request("PUT", { status: "DONE", version: 1 }), task.id);
  expect(updated.status).toBe(200); expect((await updated.json()).data.version).toBe(2);
  expect((await handlers.update(request("PUT", { title: "Stale", version: 1 }), task.id)).status).toBe(409);
  expect((await handlers.remove(request("DELETE", { version: 1 }), task.id)).status).toBe(409);
  const foreign = await db.task.create({ data: { title: "Other", ownerId: other.id } });
  expect((await handlers.update(request("PUT", { title: "Steal", version: 1 }), foreign.id)).status).toBe(403);
  expect((await handlers.remove(request("DELETE", { version: 1 }), foreign.id)).status).toBe(403);
  expect((await handlers.remove(request("DELETE", {}), task.id)).status).toBe(400);
  expect((await handlers.remove(request("DELETE", { version: 2 }), task.id)).status).toBe(204);
  expect((await handlers.read(request(), task.id)).status).toBe(404);
});
test("one persistent 60/minute valid-key quota spans endpoints and handler instances", async () => {
  const { handlers, db, api } = await fixture();
  const task = await db.task.create({ data: { title: "Quota", ownerId: api.id } });
  for (let i = 0; i < 60; i++) expect((await (i % 2 ? handlers.read(request(), task.id) : handlers.list(request()))).status).toBe(200);
  const { createPublicApiHandlers } = await import("@/server/api/public");
  const restarted = createPublicApiHandlers(db, { publicApiKey: key, apiActorEmail: "api@example.test" });
  const limited = await restarted.create(request("POST", { title: "Over quota" }));
  expect(limited.status).toBe(429); expect(Number(limited.headers.get("Retry-After"))).toBeGreaterThan(0);
  expect(await db.task.count()).toBe(1);
});
test("invalid-key attempts have their own quota and cannot spend the valid key allowance", async () => {
  const { handlers } = await fixture();
  for (let i = 0; i < 20; i++) expect((await handlers.list(request("GET", undefined, "wrong"))).status).toBe(401);
  expect((await handlers.list(request("GET", undefined, "wrong"))).status).toBe(429);
  expect((await handlers.list(request())).status).toBe(200);
});
test("deleted or elevated API actor cannot gain administrator access through its key", async () => {
  const { db, handlers, api } = await fixture();
  await db.user.update({ where: { id: api.id }, data: { role: "ADMIN" } });
  expect((await handlers.list(request())).status).toBe(403);
  await db.user.delete({ where: { id: api.id } });
  expect((await handlers.list(request())).status).toBe(403);
});
