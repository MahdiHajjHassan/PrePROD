CREATE TABLE "ActivityEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "Notification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "recipientId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "readAt" DATETIME,
  CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "ActivityEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ActivityEvent_actorId_createdAt_idx" ON "ActivityEvent"("actorId", "createdAt");
CREATE UNIQUE INDEX "Notification_recipientId_eventId_key" ON "Notification"("recipientId", "eventId");
CREATE INDEX "Notification_recipientId_readAt_idx" ON "Notification"("recipientId", "readAt");
