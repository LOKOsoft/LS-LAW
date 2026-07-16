import { prisma } from "@/lib/db/prisma";

export async function getRecentActivity(limit = 8) {
  const logs = await prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { name: true, avatarUrl: true } },
      matter: { select: { id: true, title: true, matterNumber: true } },
      client: { select: { id: true, name: true } },
    },
  });
  return logs;
}

export type RecentActivityItem = Awaited<ReturnType<typeof getRecentActivity>>[number];
