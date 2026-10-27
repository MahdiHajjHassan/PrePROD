import type { Prisma } from "@/generated/prisma/client";
import type { TaskDTO } from "@/shared/tasks";

export const taskSelect = {
  id: true, title: true, description: true, status: true, priority: true,
  version: true, createdAt: true, updatedAt: true,
  owner: { select: { id: true, displayName: true } },
} satisfies Prisma.TaskSelect;
type TaskRecord = Prisma.TaskGetPayload<{ select: typeof taskSelect }>;
export function toTaskDTO(task: TaskRecord): TaskDTO {
  return { ...task, createdAt: task.createdAt.toISOString(), updatedAt: task.updatedAt.toISOString() };
}
