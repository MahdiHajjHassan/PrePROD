import { spawnSync } from "node:child_process";
const commands = [["npm", ["run", "typecheck"]], ["npm", ["run", "lint"]], ["npm", ["test"]], ["npm", ["run", "build"]], ["node", ["scripts/audit-source.mjs"]], ["npm", ["run", "test:e2e"]]];
for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("Verification passed: types, lint, real-database tests, build, artifact audit, independently CA-verified HTTPS, and actual-browser suites.");
