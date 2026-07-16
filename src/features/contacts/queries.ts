import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getContacts(options?: { scopeUserId?: string }) {
  return prisma.contact.findMany({
    where: options?.scopeUserId
      ? {
          client: {
            OR: [
              { relationshipManagerId: options.scopeUserId },
              { matters: { some: matterScopeFilter(options.scopeUserId) } },
            ],
          },
        }
      : undefined,
    orderBy: { name: "asc" },
    include: { company: { select: { id: true, name: true } }, client: { select: { id: true, name: true } } },
  });
}

export type ContactListItem = Awaited<ReturnType<typeof getContacts>>[number];
