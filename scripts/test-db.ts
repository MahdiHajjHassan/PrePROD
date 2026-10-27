import { createDb } from "../src/server/db";
import { loadConfig } from "../src/server/config";
import { seedDatabase } from "../src/server/seed";
import { hashPassword } from "../src/server/auth/password";

const supplied = process.argv[process.argv.indexOf("--project") + 1];
const project = process.env.TASKBOARD_E2E_PROJECT;
const origin = new URL(process.env.APP_ORIGIN ?? "https://invalid");
if (!project || !/^taskboard-e2e-[a-z0-9-]+$/.test(project) || supplied !== project || origin.hostname !== "localhost" || Number(origin.port) < 1024 || process.env.DATABASE_URL !== "file:/data/taskboard.db") throw new Error("Refusing reset outside the explicitly isolated test container");
const config = loadConfig(process.env); const db = await createDb(config.databaseUrl);
try {
  await db.$transaction([db.notification.deleteMany(), db.activityEvent.deleteMany(), db.session.deleteMany(), db.task.deleteMany(), db.rateLimitBucket.deleteMany(), db.user.deleteMany()]);
  await seedDatabase(db, config);
  const passwordHash = await hashPassword(config.adminPassword);
  const a = await db.user.create({ data: { email: "member-a@example.test", displayName: "Member A", passwordHash } });
  const b = await db.user.create({ data: { email: "member-b@example.test", displayName: "Member B", passwordHash } });
  await db.task.createMany({ data: Array.from({ length: 60 }, (_, index) => ({
    ownerId: index < 55 ? a.id : b.id, title: `Demo task ${String(index).padStart(2, "0")}`,
    description: "Synthetic evaluation data", status: index < 40 ? "OPEN" as const : "DONE" as const,
    priority: index < 50 ? "HIGH" as const : "NORMAL" as const, createdAt: new Date(Date.UTC(2026, 9, 1, 0, index)),
  })) });
  console.log("Reset isolated test database with four accounts and sixty labeled synthetic tasks.");
} finally { await db.$disconnect(); }
