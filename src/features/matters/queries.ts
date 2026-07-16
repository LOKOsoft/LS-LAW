import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/** Matches matters where the given user is the responsible attorney or a team member. */
export function matterScopeFilter(userId: string): Prisma.MatterWhereInput {
  return { OR: [{ responsibleAttorneyId: userId }, { team: { some: { userId } } }] };
}

export async function isMatterInScope(matterId: string, scopeUserId: string) {
  const count = await prisma.matter.count({ where: { id: matterId, ...matterScopeFilter(scopeUserId) } });
  return count > 0;
}

export async function getScopedMatterIds(userId: string) {
  const matters = await prisma.matter.findMany({
    where: matterScopeFilter(userId),
    select: { id: true },
  });
  return matters.map((m) => m.id);
}

export async function getMatters(options?: { scopeUserId?: string }) {
  return prisma.matter.findMany({
    where: options?.scopeUserId ? matterScopeFilter(options.scopeUserId) : undefined,
    orderBy: { openedDate: "desc" },
    include: {
      client: { select: { id: true, name: true } },
      practiceArea: true,
      responsibleAttorney: { select: { name: true } },
    },
  });
}

export type MatterListItem = Awaited<ReturnType<typeof getMatters>>[number];

export async function getMatterById(id: string) {
  return prisma.matter.findUnique({
    where: { id },
    include: {
      client: true,
      practiceArea: true,
      responsibleAttorney: true,
      team: { include: { user: true } },
      hearings: { orderBy: { scheduledAt: "desc" } },
      tasks: { include: { assignee: { select: { name: true } } }, orderBy: { dueDate: "asc" } },
      documents: { include: { uploadedBy: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { issueDate: "desc" } },
      expenses: { include: { submittedBy: { select: { name: true } } }, orderBy: { incurredAt: "desc" } },
      activityLogs: { include: { actor: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 20 },
      timeEntries: { include: { user: { select: { name: true } } }, orderBy: { date: "desc" }, take: 20 },
    },
  });
}

export type MatterDetail = NonNullable<Awaited<ReturnType<typeof getMatterById>>>;

export async function getRelatedResearch(practiceAreaName: string) {
  const keyword = practiceAreaName.split(" ")[0];
  const matched = await prisma.knowledgeArticle.findMany({
    where: { category: { contains: keyword } },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });
  if (matched.length > 0) return matched;
  return prisma.knowledgeArticle.findMany({ orderBy: { publishedAt: "desc" }, take: 5 });
}

export async function getMatterFormOptions() {
  const [clients, practiceAreas, attorneys] = await Promise.all([
    prisma.client.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.practiceArea.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where: { role: { in: ["MANAGING_PARTNER", "SENIOR_PARTNER", "PARTNER", "ASSOCIATE", "JUNIOR_ASSOCIATE"] } },
      select: { id: true, name: true, title: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { clients, practiceAreas, attorneys };
}
