import { z } from "zod";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { PaginatedTasks, TaskQuery } from "@/shared/tasks";
import { DomainError } from "../errors";
import { parseInput } from "../validation";
import { taskSelect, toTaskDTO } from "./dto";

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(["OPEN", "DONE"]).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).optional(),
  ownerId: z.uuid().optional(),
  sort: z.enum(["created_desc", "created_asc", "updated_desc", "title_asc"]).default("created_desc"),
  page: z.preprocess((value) => typeof value === "string" && /^[0-9]+$/.test(value) ? Number(value) : value,
    z.number().int().min(1).max(100000)).default(1),
}).strict();

export function parseTaskQuery(input: unknown = {}): TaskQuery {
  if (input instanceof URLSearchParams) {
    const values: Record<string, unknown> = Object.create(null);
    for (const [key, value] of input) {
      if (Object.hasOwn(values, key)) throw new DomainError("VALIDATION", { query: ["duplicate"] });
      values[key] = value;
    }
    input = values;
  }
  if (input && typeof input === "object" && !Array.isArray(input)) {
    input = Object.fromEntries(Object.entries(input).filter(([key, value]) => value !== undefined && !(value === "" && ["q", "status", "priority", "ownerId"].includes(key))));
  }
  return parseInput(querySchema, input);
}

function selection(query: TaskQuery) {
  const where: Prisma.TaskWhereInput = {
    ...(query.q ? { OR: [{ title: { contains: query.q } }, { description: { contains: query.q } }] } : {}),
    ...(query.status ? { status: query.status } : {}), ...(query.priority ? { priority: query.priority } : {}),
    ...(query.ownerId ? { ownerId: query.ownerId } : {}),
  };
  const sorts: Record<TaskQuery["sort"], Prisma.TaskOrderByWithRelationInput[]> = {
    created_desc: [{ createdAt: "desc" }, { id: "desc" }], created_asc: [{ createdAt: "asc" }, { id: "asc" }],
    updated_desc: [{ updatedAt: "desc" }, { id: "desc" }], title_asc: [{ title: "asc" }, { id: "asc" }],
  };
  return { where, orderBy: sorts[query.sort] };
}

export async function queryTasks(db: PrismaClient, input: unknown = {}): Promise<PaginatedTasks> {
  const query = parseTaskQuery(input);
  const { where, orderBy } = selection(query);
  const [rows, total] = await db.$transaction([
    db.task.findMany({ where, orderBy, skip: (query.page - 1) * 25, take: 25, select: taskSelect }),
    db.task.count({ where }),
  ]);
  return { items: rows.map(toTaskDTO), total, page: query.page, pageSize: 25 };
}
export async function readAllTasks(db: PrismaClient, input: unknown = {}) {
  const query = parseTaskQuery(input);
  return (await db.task.findMany({ ...selection(query), select: taskSelect })).map(toTaskDTO);
}
