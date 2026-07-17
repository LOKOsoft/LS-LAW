import { prisma } from "@/lib/db/prisma";
import type { NotificationType, Prisma } from "@/generated/prisma/client";

type NotifyInput = {
  userIds: string[];
  type: NotificationType;
  title: string;
  body?: string;
  matterId?: string | null;
};

/** Placeholder for real delivery (email/SMS/push) — writes in-app Notification rows only. */
export async function notifyUsers(
  { userIds, type, title, body, matterId }: NotifyInput,
  client: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
  if (uniqueIds.length === 0) return;
  await client.notification.createMany({
    data: uniqueIds.map((userId) => ({ userId, type, title, body: body ?? null, matterId: matterId ?? null })),
  });
}
