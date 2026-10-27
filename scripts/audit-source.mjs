import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
const references = {
  "docs/reference/en.subject.pdf": "79e3ff965a838a6728f4c0b412a0ed7d74d4fdddc2be392c74d7ba15ec3dc659",
  "docs/reference/EVALUATION-SHEET.pdf": "46a64ff378ffc3a0e246dd7fd8e9fda65dcfb0599e66c6153bbdd807d7837037",
};
for (const [path, expected] of Object.entries(references)) if (createHash("sha256").update(await readFile(path)).digest("hex") !== expected) throw new Error(`Reference integrity failed: ${path}`);
const tracked = spawnSync("git", ["ls-files", "-z"], { encoding: "utf8" });
if (tracked.status !== 0) throw new Error("Cannot inspect tracked files");
for (const path of tracked.stdout.split("\0").filter(Boolean)) {
  if (/(^|\/)\.env(?:\.|$)/.test(path) && path !== ".env.example" || /\.(?:db|sqlite)(?:-|$)|(?:^|\/)(?:test-results|playwright-report|local-certs)\/|\.(?:pem|key)$/.test(path)) throw new Error(`Private/generated artifact tracked: ${path}`);
}
const secrets = ["ADMIN_PASSWORD", "PUBLIC_API_KEY"].map((name) => [name, process.env[name]]).filter(([, value]) => value);
async function inspect(dir) {
  for (const file of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, file.name);
    if (file.isDirectory()) await inspect(path);
    else if (/\.(?:js|json|html|map)$/.test(path)) {
      const text = await readFile(path, "utf8");
      for (const [name, value] of secrets) if (text.includes(value)) throw new Error(`Configured ${name} found in public build artifact (value omitted)`);
    }
  }
}
await inspect(".next/static");
console.log("Reference PDFs unchanged; no tracked private artifacts; configured credentials absent from public build output.");
