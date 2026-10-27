import { defineConfig } from "@playwright/test";
const port = Number(process.env.TASKBOARD_E2E_PORT ?? 8443);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Use an isolated high test port");
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1, retries: 0,
  timeout: 45000, expect: { timeout: 10000 },
  globalSetup: "./tests/helpers/e2e-setup.ts",
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: `https://localhost:${port}`, ignoreHTTPSErrors: true,
    // Automation uses an explicit local-CA exception. Global setup separately
    // verifies the real CA chain/hostname; manual browser trust is documented.
    viewport: { width: 1280, height: 900 }, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chrome", use: { browserName: "chromium", channel: "chrome", launchOptions: process.env.TASKBOARD_CHROME_EXECUTABLE ? { executablePath: process.env.TASKBOARD_CHROME_EXECUTABLE } : {} } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "edge", use: { browserName: "chromium", channel: "msedge", launchOptions: process.env.TASKBOARD_EDGE_EXECUTABLE ? { executablePath: process.env.TASKBOARD_EDGE_EXECUTABLE } : {} } },
  ],
});
