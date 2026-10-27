import type { DomainAction, DomainEntity, Prisma } from "@/generated/prisma/client";
type EventInput = { actorId: string | null; action: DomainAction; entityType: DomainEntity; entityId: string; label: string; completed?: boolean };

export async function recordDomainEvent(tx: Prisma.TransactionClient, input: EventInput): Promise<{ id: string }> {
  // Only safe, explicit metadata is stored. Passwords/tokens/email/input objects
  // have no payload field through which they can enter the event store.
  const event = await tx.activityEvent.create({ data: {
    actorId: input.actorId, action: input.action, entityType: input.entityType,
    entityId: input.entityId, label: input.label, completed: input.completed ?? false,
  }, select: { id: true } });
  if (input.action === "LOGIN") return event;
  const recipients = await tx.user.findMany({
    ...(input.entityType === "USER" ? { where: { OR: [{ id: input.entityId }, { role: "ADMIN" }] } } : {}),
    select: { id: true },
  });
  if (recipients.length) await tx.notification.createMany({ data: recipients.map((user) => ({ recipientId: user.id, eventId: event.id })) });
  return event;
}
