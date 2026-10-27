import { randomBytes } from "node:crypto";
import type { PrismaClient } from "@/generated/prisma/client";
import { hashPassword } from "./auth/password";

export type SeedInput = { adminEmail: string; adminPassword: string; apiActorEmail: string };

export async function seedDatabase(db: PrismaClient, input: SeedInput): Promise<{ created: boolean }> {
  if (await db.user.count() !== 0) return { created: false };
  const [adminHash, apiHash] = await Promise.all([
    hashPassword(input.adminPassword), hashPassword(randomBytes(32).toString("hex")),
  ]);
  return db.$transaction(async (tx) => {
    if (await tx.user.count() !== 0) return { created: false };
    await tx.user.create({ data: { email: input.adminEmail, displayName: "Administrator", passwordHash: adminHash, role: "ADMIN" } });
    await tx.user.create({ data: { email: input.apiActorEmail, displayName: "API member", passwordHash: apiHash, role: "MEMBER" } });
    return { created: true };
  });
}
