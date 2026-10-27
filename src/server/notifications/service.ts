import { z } from "zod";
import type { PrismaClient } from "@/generated/prisma/client";
import type { Actor } from "@/shared/tasks";
import { currentActor } from "../auth/policy";
import { withWriteRetry } from "../db-write";
import { DomainError } from "../errors";
import { parseInput } from "../validation";

export function createNotificationService(db: PrismaClient) {
  return {
    async list(supplied: Actor | null) {
      return db.$transaction(async (tx) => {
        const actor = await currentActor(tx, supplied);
        const rows = await tx.notification.findMany({ where: { recipientId: actor.id }, orderBy: [{ event: { createdAt: "desc" } }, { id: "desc" }], select: {
          id: true, readAt: true, event: { select: { id: true, action: true, entityType: true, entityId: true, label: true, completed: true, createdAt: true } },
        } });
        return { items: rows.map((item) => ({ ...item, readAt: item.readAt?.toISOString() ?? null, event: { ...item.event, createdAt: item.event.createdAt.toISOString() } })), unreadCount: await tx.notification.count({ where: { recipientId: actor.id, readAt: null } }) };
      });
    },
    async unreadCount(supplied: Actor | null) {
      return db.$transaction(async (tx) => { const actor = await currentActor(tx, supplied); return tx.notification.count({ where: { recipientId: actor.id, readAt: null } }); });
    },
    async markRead(supplied: Actor | null, rawId: string): Promise<void> {
      const id = parseInput(z.uuid(), rawId);
      await withWriteRetry(() => db.$transaction(async (tx) => {
        const actor = await currentActor(tx, supplied);
        const target = await tx.notification.findFirst({ where: { id, recipientId: actor.id }, select: { readAt: true } });
        if (!target) throw new DomainError("NOT_FOUND");
        if (!target.readAt) await tx.notification.update({ where: { id }, data: { readAt: new Date() } });
      }));
    },
    async markAllRead(supplied: Actor | null): Promise<void> {
      await withWriteRetry(() => db.$transaction(async (tx) => { const actor = await currentActor(tx, supplied); await tx.notification.updateMany({ where: { recipientId: actor.id, readAt: null }, data: { readAt: new Date() } }); }));
    },
  };
}
