import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { Actor, PaginatedTasks, TaskDTO } from "@/shared/tasks";
import { currentActor } from "../auth/policy";
import { withWriteRetry } from "../db-write";
import { DomainError } from "../errors";
import { parseInput } from "../validation";
import { taskSelect, toTaskDTO } from "./dto";
import { basicTaskQuerySchema, taskCreateSchema, taskIdSchema, taskPatchSchema, versionSchema } from "./schema";

async function writable(tx: Prisma.TransactionClient, supplied: Actor | null, id: string, version: number) {
  const actor = await currentActor(tx, supplied);
  const task = await tx.task.findUnique({ where: { id }, select: { ownerId: true, version: true } });
  if (!task) throw new DomainError("NOT_FOUND");
  if (task.ownerId !== actor.id && actor.role !== "ADMIN") throw new DomainError("FORBIDDEN");
  if (task.version !== version) throw new DomainError("CONFLICT");
}

export function createTaskService(db: PrismaClient) {
  return {
    async create(supplied: Actor | null, input: unknown): Promise<TaskDTO> {
      const data = parseInput(taskCreateSchema, input);
      return withWriteRetry(() => db.$transaction(async (tx) => {
        const actor = await currentActor(tx, supplied);
        return toTaskDTO(await tx.task.create({ data: { ...data, ownerId: actor.id }, select: taskSelect }));
      }));
    },
    async read(rawId: string): Promise<TaskDTO> {
      const id = parseInput(taskIdSchema, rawId);
      const task = await db.task.findUnique({ where: { id }, select: taskSelect });
      if (!task) throw new DomainError("NOT_FOUND");
      return toTaskDTO(task);
    },
    async list(query: unknown = {}): Promise<PaginatedTasks> {
      parseInput(basicTaskQuerySchema, query);
      // Basic public read for the write backend; Joseph J03 replaces this with
      // queryTasks(db, query), implementing search/filter/sort/pagination.
      const [rows, total] = await db.$transaction([
        db.task.findMany({ select: taskSelect, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 25 }),
        db.task.count(),
      ]);
      return { items: rows.map(toTaskDTO), total, page: 1, pageSize: 25 };
    },
    async update(supplied: Actor | null, rawId: string, input: unknown, expectedVersion: number): Promise<TaskDTO> {
      const id = parseInput(taskIdSchema, rawId);
      const data = parseInput(taskPatchSchema, input);
      const version = parseInput(versionSchema, expectedVersion);
      return withWriteRetry(() => db.$transaction(async (tx) => {
        await writable(tx, supplied, id, version);
        const changed = await tx.task.updateMany({ where: { id, version }, data: { ...data, version: { increment: 1 } } });
        if (changed.count !== 1) throw new DomainError("CONFLICT");
        return toTaskDTO(await tx.task.findUniqueOrThrow({ where: { id }, select: taskSelect }));
      }));
    },
    async remove(supplied: Actor | null, rawId: string, expectedVersion: number): Promise<void> {
      const id = parseInput(taskIdSchema, rawId);
      const version = parseInput(versionSchema, expectedVersion);
      await withWriteRetry(() => db.$transaction(async (tx) => {
        await writable(tx, supplied, id, version);
        const removed = await tx.task.deleteMany({ where: { id, version } });
        if (removed.count !== 1) throw new DomainError("CONFLICT");
      }));
    },
  };
}
export type TaskService = ReturnType<typeof createTaskService>;
