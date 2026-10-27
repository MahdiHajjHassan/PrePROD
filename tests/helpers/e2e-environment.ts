import { existsSync, readFileSync, mkdirSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

export function testSettings() {
  const project = process.env.TASKBOARD_E2E_PROJECT ?? "taskboard-e2e-mahdi";
  const port = Number(process.env.TASKBOARD_E2E_PORT ?? 8443);
  if (!/^taskboard-e2e-[a-z0-9-]+$/.test(project) || !Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Refusing a non-isolated test project or port");
  const envFile = resolve(process.env.TASKBOARD_E2E_ENV_FILE ?? ".env.e2e");
  if (!envFile.startsWith(`${process.cwd()}/.env.`)) throw new Error("Test credentials must use a separate ignored .env.* file");
  const logDir = resolve(".superpowers/sdd/2026-10-26-taskboard"); mkdirSync(logDir, { recursive: true });
  const values = existsSync(envFile) ? parse(readFileSync(envFile)) : {};
  const files = ["compose.yaml", ...(process.env.CODEX_PROXY_CERT ? ["compose.cloud.yaml"] : []), "compose.e2e.yaml"];
  return { project, port, envFile, logDir, values, env: { ...process.env, ...values, TASKBOARD_E2E_PROJECT: project, COMPOSE_FILE: files.join(":") } };
}
export function runTestCommand(command: string, args: string[]) {
  const settings = testSettings();
  const result = spawnSync(command, args, { env: settings.env, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  appendFileSync(resolve(settings.logDir, "e2e-commands.log"), `${command} ${args.slice(0, 4).join(" ")}\n${result.stdout ?? ""}${result.stderr ?? ""}\n`);
  if (result.status !== 0) throw new Error(`Test setup command failed (${command}); see ignored e2e-commands.log`);
  return result.stdout;
}
export function composeArgs(args: string[]) { const { project, envFile } = testSettings(); return ["compose", "--project-name", project, "--env-file", envFile, ...args]; }
export function resetTestDb() {
  const { project } = testSettings();
  const label = runTestCommand("docker", ["inspect", "--format", '{{index .Config.Labels "com.docker.compose.project"}}', `${project}-app-1`]).trim();
  if (label !== project) throw new Error("Refusing to reset a container outside the selected test project");
  runTestCommand("docker", composeArgs(["exec", "-T", "app", "./node_modules/.bin/tsx", "scripts/test-db.ts", "--project", project]));
}
