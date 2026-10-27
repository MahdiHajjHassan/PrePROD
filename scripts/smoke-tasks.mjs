import "dotenv/config";
import assert from "node:assert/strict";
import { request } from "node:https";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const origin = process.env.APP_ORIGIN ?? "https://localhost";
if (new URL(origin).protocol !== "https:") throw new Error("Task smoke requires HTTPS");
const ca = await readFile(process.env.TASKBOARD_CA_FILE ?? "local-certs/root.crt");
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("Local admin credentials are missing");
function call(path, method = "GET", body, cookie) {
  const encoded = body === undefined ? undefined : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = request(new URL(path, origin), { method, ca, rejectUnauthorized: true, timeout: 10000, headers: {
      Origin: origin,
      ...(encoded ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(encoded) } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    } }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, headers: res.headers, body: data && res.headers["content-type"]?.includes("application/json") ? JSON.parse(data) : null }); }
        catch { reject(new Error("Invalid JSON response; body intentionally omitted")); }
      });
    });
    req.on("timeout", () => req.destroy(new Error("Task smoke timed out")));
    req.on("error", reject); req.end(encoded);
  });
}
// This first assertion is also a deployment probe: an older image returns 404.
assert.equal((await call("/api/tasks")).status, 200);
const login = await call("/api/auth/login", "POST", { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
assert.equal(login.status, 200);
const cookie = login.headers["set-cookie"]?.[0]?.split(";")[0];
if (!cookie || !/^__Host-taskboard_session=[a-f0-9]{64}$/.test(cookie)) throw new Error("Session cookie missing or invalid");
let taskId;
try {
  const created = await call("/api/tasks", "POST", { title: `Task smoke ${randomUUID()}`, description: "Temporary verification task", priority: "HIGH" }, cookie);
  assert.equal(created.status, 201); taskId = created.body?.data?.id;
  if (typeof taskId !== "string") throw new Error("Created task ID missing");
  const path = `/api/tasks/${taskId}`;
  const read = await call(path); assert.equal(read.status, 200);
  assert.deepEqual(Object.keys(read.body.data.owner).sort(), ["displayName", "id"]);
  const updated = await call(path, "PUT", { status: "DONE", version: 1 }, cookie);
  assert.equal(updated.status, 200); assert.equal(updated.body?.data?.version, 2);
  assert.equal(updated.body?.data?.description, "Temporary verification task");
  assert.equal(updated.body?.data?.priority, "HIGH");
  assert.equal((await call(path, "PUT", { title: "Stale", version: 1 }, cookie)).status, 409);
  assert.equal((await call(path, "DELETE", { version: 1 }, cookie)).status, 409);
  assert.equal((await call(path, "DELETE", { version: 2 }, cookie)).status, 204);
  assert.equal((await call(path)).status, 404); taskId = undefined;
} finally {
  if (taskId) {
    const current = await call(`/api/tasks/${taskId}`);
    if (current.status === 200) assert.equal((await call(`/api/tasks/${taskId}`, "DELETE", { version: current.body.data.version }, cookie)).status, 204);
  }
  assert.equal((await call("/api/auth/logout", "POST", {}, cookie)).status, 204);
}
console.log("Verified HTTPS task create/read/update/delete, partial updates, public projection, and stale-write rejection. Temporary task removed; session revoked.");
