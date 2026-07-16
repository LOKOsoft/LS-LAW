import { prisma } from "@/lib/db/prisma";

export async function getAuditLogs(limit = 200) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: { select: { name: true, role: true } },
      matter: { select: { id: true, title: true, matterNumber: true } },
      client: { select: { id: true, name: true } },
    },
  });
}

export type AuditLogItem = Awaited<ReturnType<typeof getAuditLogs>>[number];
