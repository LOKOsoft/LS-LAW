import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getNotesList(options?: { scopeUserId?: string }) {
  return prisma.note.findMany({
    where: options?.scopeUserId
      ? { OR: [{ matter: matterScopeFilter(options.scopeUserId) }, { client: { relationshipManagerId: options.scopeUserId } }] }
      : undefined,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: {
      matter: { select: { id: true, title: true } },
      client: { select: { id: true, name: true } },
      author: { select: { name: true } },
    },
  });
}

export type NoteListItem = Awaited<ReturnType<typeof getNotesList>>[number];
