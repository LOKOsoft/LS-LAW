import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getRecentActivity(limit = 8, options?: { scopeUserId?: string }) {
  const logs = await prisma.activityLog.findMany({
    where: options?.scopeUserId
      ? { OR: [{ actorId: options.scopeUserId }, { matter: matterScopeFilter(options.scopeUserId) }] }
      : undefined,
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
