import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getMeetings(options?: { scopeUserId?: string }) {
  return prisma.meeting.findMany({
    where: options?.scopeUserId
      ? { OR: [{ matter: matterScopeFilter(options.scopeUserId) }, { client: { relationshipManagerId: options.scopeUserId } }] }
      : undefined,
    orderBy: { scheduledAt: "desc" },
    include: {
      matter: { select: { id: true, title: true, matterNumber: true } },
      client: { select: { id: true, name: true } },
    },
  });
}

export type MeetingListItem = Awaited<ReturnType<typeof getMeetings>>[number];
