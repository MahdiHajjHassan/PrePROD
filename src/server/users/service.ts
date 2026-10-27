import { z } from "zod";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { Actor } from "@/shared/tasks";
import { currentActor } from "../auth/policy";
import { withWriteRetry } from "../db-write";
import { DomainError } from "../errors";
import { parseInput } from "../validation";
import { recordDomainEvent } from "../activity/writer";

const select = { id: true, email: true, displayName: true, role: true, createdAt: true } satisfies Prisma.UserSelect;
const patchSchema = z.object({ displayName: z.string().trim().min(1).max(60).optional(), role: z.enum(["MEMBER", "ADMIN"]).optional() }).strict().refine((value) => Object.values(value).some((item) => item !== undefined));
const querySchema = z.object({ q: z.string().trim().max(100).optional(), page: z.coerce.number().int().min(1).max(100000).default(1) }).strict();
const idSchema = z.uuid();
async function administrator(tx: Prisma.TransactionClient, actor: Actor | null) {
  const current = await currentActor(tx, actor);
  if (current.role !== "ADMIN") throw new DomainError("FORBIDDEN");
  return current;
}
function dto(user: Prisma.UserGetPayload<{ select: typeof select }>) { return { ...user, createdAt: user.createdAt.toISOString() }; }
export function parseUserQuery(input: URLSearchParams) {
  if (new Set(input.keys()).size !== [...input.keys()].length) throw new DomainError("VALIDATION", { query: ["duplicate"] });
  return parseInput(querySchema, Object.fromEntries(input));
}
export function createUserService(db: PrismaClient) {
  return {
    async listUsers(actor: Actor | null, input: unknown = {}) {
      const query = parseInput(querySchema, input);
      return db.$transaction(async (tx) => {
        await administrator(tx, actor);
        const where: Prisma.UserWhereInput = query.q ? { OR: [{ email: { contains: query.q } }, { displayName: { contains: query.q } }] } : {};
        const items = await tx.user.findMany({ where, select, orderBy: [{ createdAt: "asc" }, { id: "asc" }], skip: (query.page - 1) * 25, take: 25 });
        return { items: items.map(dto), total: await tx.user.count({ where }), page: query.page, pageSize: 25 as const };
      });
    },
    async updateUser(actor: Actor | null, rawId: string, input: unknown) {
      const id = parseInput(idSchema, rawId); const data = parseInput(patchSchema, input);
      return withWriteRetry(() => db.$transaction(async (tx) => {
        const current = await administrator(tx, actor);
        const target = await tx.user.findUnique({ where: { id }, select: { role: true } });
        if (!target) throw new DomainError("NOT_FOUND");
        if (target.role === "ADMIN" && data.role === "MEMBER" && await tx.user.count({ where: { role: "ADMIN" } }) <= 1) throw new DomainError("CONFLICT", { role: ["last_admin"] });
        const user = await tx.user.update({ where: { id }, data, select });
        await recordDomainEvent(tx, { actorId: current.id, action: "UPDATE", entityType: "USER", entityId: id, label: user.displayName });
        return dto(user);
      }));
    },
    async deleteUser(actor: Actor | null, rawId: string): Promise<void> {
      const id = parseInput(idSchema, rawId);
      await withWriteRetry(() => db.$transaction(async (tx) => {
        const current = await administrator(tx, actor);
        const target = await tx.user.findUnique({ where: { id }, select: { role: true, displayName: true } });
        if (!target) throw new DomainError("NOT_FOUND");
        if (target.role === "ADMIN" && await tx.user.count({ where: { role: "ADMIN" } }) <= 1) throw new DomainError("CONFLICT", { role: ["last_admin"] });
        const tasks = await tx.task.findMany({ where: { ownerId: id }, select: { id: true, title: true } });
        for (const task of tasks) await recordDomainEvent(tx, { actorId: current.id, action: "DELETE", entityType: "TASK", entityId: task.id, label: task.title });
        await recordDomainEvent(tx, { actorId: current.id, action: "DELETE", entityType: "USER", entityId: id, label: target.displayName });
        await tx.user.delete({ where: { id } });
      }));
    },
  };
}
