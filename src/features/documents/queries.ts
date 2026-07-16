import { prisma } from "@/lib/db/prisma";

export async function getDocuments() {
  return prisma.documentFile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      matter: { select: { id: true, title: true, matterNumber: true } },
      client: { select: { id: true, name: true } },
      uploadedBy: { select: { name: true } },
      versions: true,
    },
  });
}

export type DocumentListItem = Awaited<ReturnType<typeof getDocuments>>[number];

export async function getDocumentUploadTargets() {
  return prisma.matter.findMany({
    where: { status: { in: ["INTAKE", "ACTIVE", "ON_HOLD"] } },
    select: { id: true, title: true, matterNumber: true },
    orderBy: { title: "asc" },
  });
}
