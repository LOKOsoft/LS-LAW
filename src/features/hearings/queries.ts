import { prisma } from "@/lib/db/prisma";

export async function getHearings() {
  return prisma.hearing.findMany({
    orderBy: { scheduledAt: "desc" },
    include: { matter: { select: { id: true, title: true, matterNumber: true, client: { select: { name: true } } } } },
  });
}
export type HearingListItem = Awaited<ReturnType<typeof getHearings>>[number];
