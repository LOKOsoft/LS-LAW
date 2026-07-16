import { prisma } from "@/lib/db/prisma";

export async function getClients() {
  return prisma.client.findMany({
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

export async function getRelationshipManagerOptions() {
  return prisma.user.findMany({
    where: { role: { in: ["MANAGING_PARTNER", "SENIOR_PARTNER", "ASSOCIATE"] } },
    select: { id: true, name: true, title: true },
    orderBy: { name: "asc" },
  });
}
