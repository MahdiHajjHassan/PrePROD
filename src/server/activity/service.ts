import type { PrismaClient } from "@/generated/prisma/client";
import type { Actor } from "@/shared/tasks";
import { currentActor } from "../auth/policy";

const zero = () => ({ created: 0, completed: 0, deleted: 0 });
const day = 86400000;
export function createActivityService(db: PrismaClient) {
  return {
    async getSummary(supplied: Actor | null, now = new Date()) {
      return db.$transaction(async (tx) => {
        const actor = await currentActor(tx, supplied);
        const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const start = today - 6 * day; const end = today + day; const previousStart = start - 7 * day;
        const events = await tx.activityEvent.findMany({ where: { actorId: actor.id, entityType: "TASK", createdAt: { gte: new Date(previousStart), lt: new Date(end) } }, select: { action: true, completed: true, createdAt: true } });
        const current = zero(); const previous = zero();
        const days = Array.from({ length: 7 }, (_, index) => ({ date: new Date(start + index * day).toISOString().slice(0, 10), ...zero() }));
        for (const event of events) {
          const metric = event.action === "CREATE" ? "created" : event.action === "DELETE" ? "deleted" : event.action === "UPDATE" && event.completed ? "completed" : null;
          if (!metric) continue;
          const stamp = event.createdAt.getTime();
          if (stamp < start) previous[metric]++;
          else { current[metric]++; days[Math.floor((stamp - start) / day)][metric]++; }
        }
        return { current, previous, delta: { created: current.created - previous.created, completed: current.completed - previous.completed, deleted: current.deleted - previous.deleted }, days, from: new Date(start).toISOString(), to: new Date(end).toISOString() };
      });
    },
  };
}
