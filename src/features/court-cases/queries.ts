import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getCourtCases(options?: { scopeUserId?: string }) {
  return prisma.courtCase.findMany({
    where: options?.scopeUserId ? { matter: matterScopeFilter(options.scopeUserId) } : undefined,
    orderBy: { nextHearingDate: "asc" },
    include: {
      matter: {
        select: { id: true, title: true, matterNumber: true, client: { select: { name: true } }, status: true },
      },
    },
  });
}

export type CourtCaseListItem = Awaited<ReturnType<typeof getCourtCases>>[number];
