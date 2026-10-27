import "dotenv/config";
import assert from "node:assert/strict";
import { request } from "node:https";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const origin = process.env.APP_ORIGIN ?? "https://localhost";
if (new URL(origin).protocol !== "https:" || !process.env.PUBLIC_API_KEY) throw new Error("HTTPS origin and private API key are required");
const ca = await readFile(process.env.TASKBOARD_CA_FILE ?? "local-certs/root.crt");
async function call(path, method = "GET", body, key = process.env.PUBLIC_API_KEY) {
  const encoded = body === undefined ? undefined : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = request(new URL(`/api/public/v1${path}`, origin), { method, ca, rejectUnauthorized: true, timeout: 10000,
      headers: { "X-API-Key": key, ...(encoded ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(encoded) } : {}) } }, (res) => {
      let data = ""; res.on("data", (chunk) => { data += chunk; }); res.on("end", () => {
        try { resolve({ status: res.statusCode, body: data && res.headers["content-type"]?.includes("application/json") ? JSON.parse(data) : null }); }
        catch { reject(new Error("Invalid API JSON; response intentionally omitted")); }
      });
    });
    req.on("error", reject); req.on("timeout", () => req.destroy(new Error("API smoke timed out"))); req.end(encoded);
  });
}
assert.equal((await call("/tasks", "GET", undefined, "invalid-demo-key")).status, 401);
assert.equal((await call("/tasks")).status, 200);
let taskId;
try {
  const created = await call("/tasks", "POST", { title: `API smoke ${randomUUID()}` }); assert.equal(created.status, 201); taskId = created.body?.data?.id;
  if (typeof taskId !== "string") throw new Error("Missing created task ID");
  assert.equal((await call(`/tasks/${taskId}`)).status, 200);
  const updated = await call(`/tasks/${taskId}`, "PUT", { status: "DONE", version: 1 }); assert.equal(updated.status, 200); assert.equal(updated.body?.data?.version, 2);
  assert.equal((await call(`/tasks/${taskId}`, "DELETE", { version: 1 })).status, 409);
  assert.equal((await call(`/tasks/${taskId}`, "DELETE", { version: 2 })).status, 204); taskId = undefined;
} finally {
  if (taskId) {
    const current = await call(`/tasks/${taskId}`);
    if (current.status === 200) assert.equal((await call(`/tasks/${taskId}`, "DELETE", { version: current.body.data.version })).status, 204);
  }
}
console.log("Verified all five key-authenticated API operations over trusted HTTPS, invalid-key rejection, and stale-delete protection. Temporary task removed; key not printed.");
