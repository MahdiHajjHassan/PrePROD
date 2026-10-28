import { expect, test } from "vitest";
import { resolve } from "node:path";

const valid = {
  DATABASE_URL: "file:./data/test.db", APP_ORIGIN: "https://localhost:8443",
  ADMIN_EMAIL: " ADMIN@TICTACTOE.LOCAL ", ADMIN_PASSWORD: "a-long-local-password",
};

test("configuration normalizes identities and resolves one consistent SQLite location", async () => {
  const { loadConfig } = await import("@/server/config");
  const config = loadConfig(valid);
  expect(config.adminEmail).toBe("admin@tictactoe.local");
  expect(config.databaseUrl).toBe(`file:${resolve("data/test.db")}`);
  expect(config.appOrigin).toBe("https://localhost:8443");
});

test.each(["http://localhost", "https://example.test/path", "https://user:pass@example.test", "https://example.test?q=1"])("configuration rejects unsafe or non-origin APP_ORIGIN %s", async (origin) => {
  const { loadConfig } = await import("@/server/config");
  expect(() => loadConfig({ ...valid, APP_ORIGIN: origin })).toThrow();
});

test("configuration needs only game settings and rejects short administrator passwords", async () => {
  const { loadConfig } = await import("@/server/config");
  expect(() => loadConfig({APP_ORIGIN:valid.APP_ORIGIN,ADMIN_EMAIL:valid.ADMIN_EMAIL,ADMIN_PASSWORD:valid.ADMIN_PASSWORD})).not.toThrow();
  expect(() => loadConfig({...valid,ADMIN_PASSWORD:"short"})).toThrow();
});

test("bootstrap rejects administrator email addresses that cannot use the browser login", async () => {
  const { loadConfig } = await import("@/server/config");
  expect(() => loadConfig({ ...valid, ADMIN_EMAIL: `a@${"a.".repeat(126)}com` })).toThrow();
});

test("bootstrap rejects malformed administrator passwords before account seeding", async () => {
  const { loadConfig } = await import("@/server/config");
  expect(() => loadConfig({ ...valid, ADMIN_PASSWORD: "correct-password-\ud800" })).toThrow();
});
