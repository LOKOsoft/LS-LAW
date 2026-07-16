import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getClients(options?: { scopeUserId?: string }) {
  return prisma.client.findMany({
    where: options?.scopeUserId
      ? {
          OR: [
            { relationshipManagerId: options.scopeUserId },
            { matters: { some: matterScopeFilter(options.scopeUserId) } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      relationshipManager: { select: { name: true } },
      _count: { select: { matters: true, invoices: true } },
    },
  });
}

export type ClientListItem = Awaited<ReturnType<typeof getClients>>[number];

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      relationshipManager: { select: { id: true, name: true, title: true, email: true, avatarUrl: true } },
      matters: {
        include: { practiceArea: true, responsibleAttorney: { select: { name: true } } },
        orderBy: { openedDate: "desc" },
      },
      invoices: { orderBy: { issueDate: "desc" }, take: 20 },
      documents: { orderBy: { createdAt: "desc" }, take: 20, include: { uploadedBy: { select: { name: true } } } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
      meetings: { orderBy: { scheduledAt: "desc" } },
      communicationLogs: { orderBy: { occurredAt: "desc" }, include: { loggedBy: { select: { name: true } } } },
      retainers: true,
    },
  });
}

export type ClientDetail = NonNullable<Awaited<ReturnType<typeof getClientById>>>;

export async function isClientInScope(clientId: string, scopeUserId: string) {
  const count = await prisma.client.count({
    where: {
      id: clientId,
      OR: [{ relationshipManagerId: scopeUserId }, { matters: { some: matterScopeFilter(scopeUserId) } }],
    },
  });
  return count > 0;
}

export async function getRelationshipManagerOptions() {
  return prisma.user.findMany({
    where: { role: { in: ["MANAGING_PARTNER", "SENIOR_PARTNER", "PARTNER", "ASSOCIATE", "JUNIOR_ASSOCIATE"] } },
    select: { id: true, name: true, title: true },
    orderBy: { name: "asc" },
  });
}
