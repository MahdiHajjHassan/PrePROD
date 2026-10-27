import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { Actor, PaginatedTasks, TaskDTO } from "@/shared/tasks";
import { z } from "zod";
import { currentActor } from "../auth/policy";
import { withWriteRetry } from "../db-write";
import { DomainError } from "../errors";
import { parseInput } from "../validation";
import { taskSelect, toTaskDTO } from "./dto";
import { taskCreateSchema, taskIdSchema, taskPatchSchema, taskPortableSchema, versionSchema } from "./schema";
import { queryTasks } from "./query";
import { recordDomainEvent } from "../activity/writer";

async function taskActor(tx: Prisma.TransactionClient, supplied: Actor | null, memberOnly: boolean) {
  const actor = await currentActor(tx, supplied);
  if (memberOnly && actor.role !== "MEMBER") throw new DomainError("FORBIDDEN");
  return actor;
}
async function writable(tx: Prisma.TransactionClient, supplied: Actor | null, id: string, version: number, memberOnly: boolean) {
  const actor = await taskActor(tx, supplied, memberOnly);
  const task = await tx.task.findUnique({ where: { id }, select: { ownerId: true, version: true, title: true, status: true } });
  if (!task) throw new DomainError("NOT_FOUND");
  if (task.ownerId !== actor.id && actor.role !== "ADMIN") throw new DomainError("FORBIDDEN");
  if (task.version !== version) throw new DomainError("CONFLICT");
  return { task, actor };
}

export function createTaskService(db: PrismaClient, options: { memberOnly?: boolean } = {}) {
  const memberOnly = options.memberOnly ?? false;
  return {
    async create(supplied: Actor | null, input: unknown): Promise<TaskDTO> {
      const data = parseInput(taskCreateSchema, input);
      return withWriteRetry(() => db.$transaction(async (tx) => {
        const actor = await taskActor(tx, supplied, memberOnly);
        const task = await tx.task.create({ data: { ...data, ownerId: actor.id }, select: taskSelect });
        await recordDomainEvent(tx, { actorId: actor.id, action: "CREATE", entityType: "TASK", entityId: task.id, label: task.title });
        return toTaskDTO(task);
      }));
    },
    async read(rawId: string): Promise<TaskDTO> {
      const id = parseInput(taskIdSchema, rawId);
      const task = await db.task.findUnique({ where: { id }, select: taskSelect });
      if (!task) throw new DomainError("NOT_FOUND");
      return toTaskDTO(task);
    },
    async importMany(supplied: Actor | null, input: unknown): Promise<{ created: number }> {
      const rows = parseInput(z.array(taskPortableSchema).min(1).max(200), input);
      return withWriteRetry(() => db.$transaction(async (tx) => {
        const actor = await taskActor(tx, supplied, memberOnly);
        for (const data of rows) {
          const task = await tx.task.create({ data: { ...data, ownerId: actor.id }, select: { id: true, title: true } });
          await recordDomainEvent(tx, { actorId: actor.id, action: "CREATE", entityType: "TASK", entityId: task.id, label: task.title });
        }
        return { created: rows.length };
      }));
    },
    async list(query: unknown = {}): Promise<PaginatedTasks> {
      return queryTasks(db, query);
    },
    owners() { return db.user.findMany({ where: { tasks: { some: {} } }, select: { id: true, displayName: true }, orderBy: [{ displayName: "asc" }, { id: "asc" }] }); },
    async update(supplied: Actor | null, rawId: string, input: unknown, expectedVersion: number): Promise<TaskDTO> {
      const id = parseInput(taskIdSchema, rawId);
      const data = parseInput(taskPatchSchema, input);
      const version = parseInput(versionSchema, expectedVersion);
      return withWriteRetry(() => db.$transaction(async (tx) => {
        const { task: before, actor } = await writable(tx, supplied, id, version, memberOnly);
        const changed = await tx.task.updateMany({ where: { id, version }, data: { ...data, version: { increment: 1 } } });
        if (changed.count !== 1) throw new DomainError("CONFLICT");
        const task = await tx.task.findUniqueOrThrow({ where: { id }, select: taskSelect });
        await recordDomainEvent(tx, { actorId: actor.id, action: "UPDATE", entityType: "TASK", entityId: id, label: task.title, completed: before.status === "OPEN" && task.status === "DONE" });
        return toTaskDTO(task);
      }));
    },
    async remove(supplied: Actor | null, rawId: string, expectedVersion: number): Promise<void> {
      const id = parseInput(taskIdSchema, rawId);
      const version = parseInput(versionSchema, expectedVersion);
      await withWriteRetry(() => db.$transaction(async (tx) => {
        const { task, actor } = await writable(tx, supplied, id, version, memberOnly);
        const removed = await tx.task.deleteMany({ where: { id, version } });
        if (removed.count !== 1) throw new DomainError("CONFLICT");
        await recordDomainEvent(tx, { actorId: actor.id, action: "DELETE", entityType: "TASK", entityId: id, label: task.title });
      }));
    },
  };
}
export type TaskService = ReturnType<typeof createTaskService>;
