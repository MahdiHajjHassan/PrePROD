import { expect, test } from "vitest";
import { spawnSync } from "node:child_process";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
test("test reset command refuses ordinary projects, ordinary origins and local databases without deleting data", async () => {
  const { db, url, close } = await createTestDb();
  try {
    const user = await seedUser(db); await db.task.create({ data: { title: "Never reset this", ownerId: user.actor.id } });
    for (const [project, origin] of [["taskboard-mahdi", "https://localhost"], ["taskboard-e2e-proof", "https://localhost"], ["taskboard-e2e-proof", "https://localhost:8443"]]) {
      const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/test-db.ts", "--project", project], { encoding: "utf8", env: { PATH: process.env.PATH, TASKBOARD_E2E_PROJECT: project, APP_ORIGIN: origin, DATABASE_URL: url } });
      expect(result.status).not.toBe(0); expect(result.stderr).toContain("Refusing reset outside"); expect(await db.task.count()).toBe(1);
    }
  } finally { await close(); }
});
