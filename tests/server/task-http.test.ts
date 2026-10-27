import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";

const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
async function fixture() {
  const { db, close } = await createTestDb(); cleanup.push(close);
  const { createTaskService } = await import("@/server/tasks/service");
  const { createAuthService } = await import("@/server/auth/service");
  const { createTaskHandlers } = await import("@/server/tasks/http");
  const tasks = createTaskService(db); const auth = createAuthService(db);
  const a = await seedUser(db, { displayName: "A" }); const b = await seedUser(db);
  const session = await auth.login({ email: a.email, password: a.password }, "a-client");
  const second = await auth.login({ email: b.email, password: b.password }, "b-client");
  return { db, tasks, auth, handlers: createTaskHandlers(tasks, auth, { appOrigin: "https://localhost" }),
    a: a.actor, b: b.actor, cookie: `__Host-taskboard_session=${session.token}`, secondCookie: `__Host-taskboard_session=${second.token}` };
}
function request(method = "GET", body?: unknown, cookie?: string, origin: string | null = "https://localhost", contentType = "application/json", path = "/api/tasks") {
  const headers = new Headers({ "Content-Type": contentType });
  if (cookie) headers.set("Cookie", cookie);
  if (origin !== null) headers.set("Origin", origin);
  return new Request(`https://localhost${path}`, { method, headers, ...(method === "GET" ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }) });
}

test("the HTTP lifecycle exposes safe guest reads and requires the latest version for writes", async () => {
  const { handlers, cookie } = await fixture();
  const created = await handlers.create(request("POST", { title: "  HTTP task  " }, cookie));
  expect(created.status).toBe(201);
  const { data: task } = await created.json();
  expect(task).toMatchObject({ title: "HTTP task", version: 1 });
  const publicRead = await handlers.read(request(), task.id);
  expect(publicRead.status).toBe(200);
  expect(Object.keys((await publicRead.json()).data.owner).sort()).toEqual(["displayName", "id"]);
  const listed = await handlers.list(request());
  expect(listed.status).toBe(200);
  expect((await listed.json()).data.items).toHaveLength(1);
  expect(listed.headers.get("Cache-Control")).toContain("no-store");
  const update = await handlers.update(request("PUT", { title: "Updated", version: 1 }, cookie), task.id);
  expect(update.status).toBe(200);
  expect((await update.json()).data.version).toBe(2);
  const stale = await handlers.remove(request("DELETE", { version: 1 }, cookie), task.id);
  expect(stale.status).toBe(409);
  expect(await stale.json()).toEqual({ error: { code: "CONFLICT" } });
  const removed = await handlers.remove(request("DELETE", { version: 2 }, cookie), task.id);
  expect(removed.status).toBe(204); expect(await removed.text()).toBe("");
  expect((await handlers.read(request(), task.id)).status).toBe(404);
});

test("task mutations reject anonymous, ambiguous, revoked, and deleted-user sessions", async () => {
  const { db, handlers, auth, a, cookie } = await fixture();
  for (const invalid of [undefined, "__Host-taskboard_session=invalid", `${cookie}; ${cookie}`]) {
    expect((await handlers.create(request("POST", { title: "Task" }, invalid))).status).toBe(401);
  }
  await auth.logout(cookie.split("=")[1]);
  expect((await handlers.create(request("POST", { title: "Task" }, cookie))).status).toBe(401);
  await db.user.delete({ where: { id: a.id } });
  expect((await handlers.create(request("POST", { title: "Task" }, cookie))).status).toBe(401);
  expect(await db.task.count()).toBe(0);
});

test("another member cannot update or delete an owner's task through HTTP", async () => {
  const { tasks, a, handlers, secondCookie } = await fixture();
  const task = await tasks.create(a, { title: "Owned" });
  expect((await handlers.update(request("PUT", { title: "Stolen", version: 1 }, secondCookie), task.id)).status).toBe(403);
  expect((await handlers.remove(request("DELETE", { version: 1 }, secondCookie), task.id)).status).toBe(403);
  expect((await tasks.read(task.id)).version).toBe(1);
});

test("each task mutation rejects a missing or foreign Origin before changing data", async () => {
  const { tasks, a, handlers, cookie } = await fixture();
  const task = await tasks.create(a, { title: "Keep" });
  for (const origin of [null, "https://attacker.example"]) {
    expect((await handlers.create(request("POST", { title: "New" }, cookie, origin))).status).toBe(403);
    expect((await handlers.update(request("PUT", { title: "Changed", version: 1 }, cookie, origin), task.id)).status).toBe(403);
    expect((await handlers.remove(request("DELETE", { version: 1 }, cookie, origin), task.id)).status).toBe(403);
  }
  expect((await tasks.read(task.id)).title).toBe("Keep");
});

test("task HTTP bodies reject malformed/oversized JSON, privileged fields and missing revisions", async () => {
  const { tasks, a, handlers, cookie } = await fixture();
  const task = await tasks.create(a, { title: "Keep" });
  for (const invalid of [request("POST", "{", cookie), request("POST", { title: "x".repeat(17000) }, cookie), request("POST", { title: "Task" }, cookie, "https://localhost", "text/plain"), request("POST", { title: "Task", ownerId: a.id }, cookie)]) {
    expect((await handlers.create(invalid)).status).toBe(400);
  }
  for (const invalid of [{ title: "No revision" }, { version: 1 }, { version: 1, role: "ADMIN" }, { version: "1", title: "String revision" }]) {
    expect((await handlers.update(request("PUT", invalid, cookie), task.id)).status).toBe(400);
  }
  expect((await handlers.remove(request("DELETE", {}, cookie), task.id)).status).toBe(400);
  expect((await tasks.read(task.id)).version).toBe(1);
});

test("query options are explicitly unavailable before Joseph's J03 implementation", async () => {
  const { handlers } = await fixture();
  expect((await handlers.list(request("GET", undefined, undefined, null, "application/json", "/api/tasks?page=2"))).status).toBe(400);
  expect((await handlers.read(request(), "bad-id")).status).toBe(400);
});
