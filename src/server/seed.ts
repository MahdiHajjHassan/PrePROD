import { randomBytes } from "node:crypto";
import { hash } from "@node-rs/argon2";
import type { PrismaClient } from "@/generated/prisma/client";

// The library defaults to Argon2id; its ambient const enum is not isolated-module safe.
const hashOptions = { memoryCost: 19456, timeCost: 2, parallelism: 1 };
export type SeedInput = { adminEmail: string; adminPassword: string; apiActorEmail: string };

export async function seedDatabase(db: PrismaClient, input: SeedInput): Promise<{ created: boolean }> {
  if (await db.user.count() !== 0) return { created: false };
  const [adminHash, apiHash] = await Promise.all([
    hash(input.adminPassword, hashOptions), hash(randomBytes(32).toString("hex"), hashOptions),
  ]);
  return db.$transaction(async (tx) => {
    if (await tx.user.count() !== 0) return { created: false };
    await tx.user.create({ data: { email: input.adminEmail, displayName: "Administrator", passwordHash: adminHash, role: "ADMIN" } });
    await tx.user.create({ data: { email: input.apiActorEmail, displayName: "API member", passwordHash: apiHash, role: "MEMBER" } });
    return { created: true };
  });
}
