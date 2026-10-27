import { expect, test } from "vitest";
import { resolve } from "node:path";

const valid = {
  DATABASE_URL: "file:./data/test.db", APP_ORIGIN: "https://localhost:8443",
  ADMIN_EMAIL: " ADMIN@TASKBOARD.LOCAL ", ADMIN_PASSWORD: "a-long-local-password",
  API_ACTOR_EMAIL: "api@taskboard.local", PUBLIC_API_KEY: "a".repeat(64),
};

test("configuration normalizes identities and resolves one consistent SQLite location", async () => {
  const { loadConfig } = await import("@/server/config");
  const config = loadConfig(valid);
  expect(config.adminEmail).toBe("admin@taskboard.local");
  expect(config.databaseUrl).toBe(`file:${resolve("data/test.db")}`);
  expect(config.appOrigin).toBe("https://localhost:8443");
});

test.each(["http://localhost", "https://example.test/path", "https://user:pass@example.test", "https://example.test?q=1"])("configuration rejects unsafe or non-origin APP_ORIGIN %s", async (origin) => {
  const { loadConfig } = await import("@/server/config");
  expect(() => loadConfig({ ...valid, APP_ORIGIN: origin })).toThrow();
});

test("configuration rejects shared admin/API identities and placeholder secrets", async () => {
  const { loadConfig } = await import("@/server/config");
  expect(() => loadConfig({ ...valid, API_ACTOR_EMAIL: "admin@taskboard.local" })).toThrow();
  expect(() => loadConfig({ ...valid, PUBLIC_API_KEY: "replace-me" })).toThrow();
});
