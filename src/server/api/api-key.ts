import { createHash, timingSafeEqual } from "node:crypto";
import type { PrismaClient } from "@/generated/prisma/client";
import type { ServerConfig } from "../config";
import type { Actor } from "@/shared/tasks";
import { DomainError } from "../errors";
import { clientKey } from "../security/origin";
import { createRateLimiter } from "../security/rate-limit";

export function createApiAuthenticator(db: PrismaClient, config: Pick<ServerConfig, "publicApiKey" | "apiActorEmail">) {
  const expected = createHash("sha256").update(config.publicApiKey).digest();
  const consume = createRateLimiter(db);
  return async function authenticateApiKey(request: Request): Promise<Actor> {
    const supplied = request.headers.get("X-API-Key") ?? "";
    const valid = /^[a-f0-9]{64}$/i.test(supplied) && timingSafeEqual(createHash("sha256").update(supplied).digest(), expected);
    const quota = valid ? await consume("public-api-key", expected.toString("hex"), 60, 60) : await consume("public-api-invalid", clientKey(request), 20, 60);
    if (!quota.allowed) throw new DomainError("RATE_LIMITED", undefined, quota.retryAfterSeconds);
    if (!valid) throw new DomainError("UNAUTHENTICATED");
    const user = await db.user.findUnique({ where: { email: config.apiActorEmail }, select: { id: true, role: true } });
    // The external key must never become an administrator credential.
    if (!user || user.role !== "MEMBER") throw new DomainError("FORBIDDEN");
    return user;
  };
}
