import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getDocuments(options?: { scopeUserId?: string }) {
  return prisma.documentFile.findMany({
    where: options?.scopeUserId
      ? {
          OR: [
            { matter: matterScopeFilter(options.scopeUserId) },
            { client: { relationshipManagerId: options.scopeUserId } },
          ],
        }
      : undefined,
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

export async function getDocumentUploadTargets(options?: { scopeUserId?: string }) {
  return prisma.matter.findMany({
    where: {
      status: { in: ["INTAKE", "ACTIVE", "ON_HOLD"] },
      ...(options?.scopeUserId ? matterScopeFilter(options.scopeUserId) : {}),
    },
    select: { id: true, title: true, matterNumber: true },
    orderBy: { title: "asc" },
  });
}
