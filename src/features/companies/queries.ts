import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getCompanies(options?: { scopeUserId?: string }) {
  return prisma.company.findMany({
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
    include: { client: { select: { id: true, name: true, status: true } }, _count: { select: { contacts: true } } },
  });
}

export type CompanyListItem = Awaited<ReturnType<typeof getCompanies>>[number];

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: { client: true, contacts: { orderBy: { isPrimary: "desc" } } },
  });
}

export type CompanyDetail = NonNullable<Awaited<ReturnType<typeof getCompanyById>>>;
