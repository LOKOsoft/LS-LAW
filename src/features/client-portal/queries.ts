import { prisma } from "@/lib/db/prisma";
import { MatterStatus } from "@/generated/prisma/client";

export async function getPortalOverview(clientId: string) {
  const [matters, upcomingHearings, invoiceSummary, recentDocuments] = await Promise.all([
    prisma.matter.findMany({
      where: { clientId },
      orderBy: { openedDate: "desc" },
      include: { practiceArea: true, responsibleAttorney: { select: { name: true, title: true } } },
    }),
    prisma.hearing.findMany({
      where: { matter: { clientId }, scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
      take: 5,
      include: { matter: { select: { title: true } } },
    }),
    prisma.invoice.aggregate({
      where: { clientId },
      _sum: { total: true, amountPaid: true },
    }),
    prisma.documentFile.findMany({
      where: { clientId, isShared: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const activeMatters = matters.filter((m) => m.status === MatterStatus.ACTIVE || m.status === MatterStatus.INTAKE);
  const outstanding = (invoiceSummary._sum.total ?? 0) - (invoiceSummary._sum.amountPaid ?? 0);

  return { matters, activeMatters, upcomingHearings, outstanding, recentDocuments };
}

export async function getPortalDocuments(clientId: string) {
  return prisma.documentFile.findMany({
    where: {
      isShared: true,
      OR: [{ clientId }, { matter: { clientId } }],
    },
    orderBy: { createdAt: "desc" },
    include: { matter: { select: { title: true } } },
  });
}

export async function getPortalInvoices(clientId: string) {
  return prisma.invoice.findMany({
    where: { clientId },
    orderBy: { issueDate: "desc" },
    include: { matter: { select: { title: true } } },
  });
}

export async function getPortalMessages(clientId: string) {
  return prisma.communicationLog.findMany({
    where: { clientId },
    orderBy: { occurredAt: "desc" },
    include: { loggedBy: { select: { name: true, title: true } } },
  });
}
