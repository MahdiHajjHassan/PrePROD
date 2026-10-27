import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
function capture(command, args, cwd = process.cwd(), env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`Rehearsal command failed: ${command} ${args.join(" ")} (output saved in ignored rehearsal log)`);
  return result.stdout;
}
const source = capture("git", ["rev-parse", "--show-toplevel"]).trim();
const branch = capture("git", ["branch", "--show-current"]).trim();
if (!branch) throw new Error("Rehearsal needs a named committed source branch");
const revision = capture("git", ["rev-parse", "HEAD"]).trim();
if (capture("git", ["diff", "HEAD", "--name-only"]).trim()) throw new Error("Commit tracked changes before rehearsing their exact revision");
const root = await mkdtemp(join(tmpdir(), "taskboard-rehearsal-")); const checkout = join(root, "checkout");
const logDir = resolve(".superpowers/sdd/2026-10-26-taskboard"); await mkdir(logDir, { recursive: true });
let log = `Source ${revision}\nFresh checkout ${checkout}\n`;
async function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  log += `\n${command} ${args.join(" ")}\n${result.stdout ?? ""}${result.stderr ?? ""}`;
  await writeFile(join(logDir, "rehearsal.log"), log, { mode: 0o600 });
  if (result.status !== 0) throw new Error(`Rehearsal failed at ${command}; see ignored rehearsal.log`);
}
await run("git", ["clone", "--no-hardlinks", "--branch", branch, source, checkout], source);
if (capture("git", ["rev-parse", "HEAD"], checkout).trim() !== revision) throw new Error("Fresh clone revision mismatch");
await run("npm", ["ci"], checkout);
await run("node", ["--", "scripts/setup.mjs", "--port", "9443"], checkout);
for (const args of [["run", "db:migrate"], ["run", "db:seed"], ["test"], ["run", "typecheck"], ["run", "lint"], ["run", "build"]]) await run("npm", args, checkout);
await run("node", ["scripts/audit-source.mjs"], checkout);
await run("npm", ["run", "test:e2e", "--", "--project=chrome"], checkout, { ...process.env, TASKBOARD_E2E_PROJECT: "taskboard-e2e-rehearsal", TASKBOARD_E2E_PORT: "9443", TASKBOARD_E2E_ENV_FILE: join(checkout, ".env.e2e") });
await writeFile(join(logDir, "rehearsal-result.json"), JSON.stringify({ revision, checkout, project: "taskboard-e2e-rehearsal", port: 9443, status: "passed", checks: "fresh clone, npm ci, private setup, migrations, seed, server tests, types, lint, build, artifact audit, isolated HTTPS Chrome flows" }, null, 2));
console.log(`Fresh-clone rehearsal passed at ${revision.slice(0, 7)}. Separate local checkout and isolated test project retained for inspection.`);
