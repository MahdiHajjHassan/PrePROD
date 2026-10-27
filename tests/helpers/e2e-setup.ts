import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { request } from "node:https";
import { testSettings, runTestCommand, composeArgs } from "./e2e-environment";

export default async function setup() {
  let settings = testSettings();
  if (!existsSync(settings.envFile)) runTestCommand("node", ["--", "scripts/setup.mjs", "--env-file", settings.envFile, "--port", String(settings.port)]);
  settings = testSettings();
  if (settings.values.APP_ORIGIN !== `https://localhost:${settings.port}` || settings.values.HTTPS_PORT !== String(settings.port)) throw new Error("Test environment URL/port mismatch; normal environment is never overwritten");
  const image = process.env.TASKBOARD_E2E_IMAGE;
  if (image) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$/.test(image)) throw new Error("Invalid local test image name");
    runTestCommand("docker", ["tag", image, `${settings.project}-app`]);
  }
  runTestCommand("docker", composeArgs(["up", image ? "--no-build" : "--build", "-d", "--force-recreate", "--wait"]));
  mkdirSync("local-certs", { recursive: true });
  const certificate = resolve(`local-certs/${settings.project}.crt`);
  runTestCommand("docker", composeArgs(["cp", "proxy:/data/caddy/pki/authorities/local/root.crt", certificate]));
  await new Promise<void>((done, reject) => {
    const req = request(`${settings.values.APP_ORIGIN}/api/health`, { ca: readFileSync(certificate), rejectUnauthorized: true, timeout: 10000 }, (res) => {
      let body = ""; res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => { if (res.statusCode === 200 && body === '{"status":"ok","database":"ok"}') done(); else reject(new Error("Test HTTPS readiness failed")); });
    });
    req.on("error", reject); req.on("timeout", () => req.destroy(new Error("Test TLS timeout"))); req.end();
  });
  console.log("Isolated test application ready; real HTTPS CA chain and hostname verified. Browser automation local-CA exception is explicit.");
}
