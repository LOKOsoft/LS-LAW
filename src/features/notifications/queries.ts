import { prisma } from "@/lib/db/prisma";

export async function getNotifications(userId: string, limit = 8) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { matter: { select: { id: true, title: true, matterNumber: true } } },
  });
}

export type NotificationItem = Awaited<ReturnType<typeof getNotifications>>[number];

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}
