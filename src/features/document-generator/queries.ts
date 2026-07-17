import { prisma } from "@/lib/db/prisma";

export async function getGeneratedDocuments(options?: { matterId?: string; clientId?: string }) {
  return prisma.generatedDocument.findMany({
    where: { matterId: options?.matterId, clientId: options?.clientId },
    include: {
      createdBy: { select: { name: true } },
      reviewedBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
      matter: { select: { title: true } },
      client: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}
export type GeneratedDocumentListItem = Awaited<ReturnType<typeof getGeneratedDocuments>>[number];

export async function getGeneratedDocumentById(id: string) {
  return prisma.generatedDocument.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      reviewedBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
      versions: { orderBy: { version: "desc" }, include: { createdBy: { select: { name: true } } } },
      matter: { select: { id: true, title: true } },
      client: { select: { id: true, name: true } },
    },
  });
}
export type GeneratedDocumentDetail = NonNullable<Awaited<ReturnType<typeof getGeneratedDocumentById>>>;
