import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getHearings(options?: { scopeUserId?: string }) {
  return prisma.hearing.findMany({
    where: options?.scopeUserId ? { matter: matterScopeFilter(options.scopeUserId) } : undefined,
    orderBy: { scheduledAt: "desc" },
    include: { matter: { select: { id: true, title: true, matterNumber: true, client: { select: { name: true } } } } },
  });
}
export type HearingListItem = Awaited<ReturnType<typeof getHearings>>[number];
