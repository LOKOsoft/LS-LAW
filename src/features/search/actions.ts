"use server";

import { prisma } from "@/lib/db/prisma";

export type GlobalSearchResult = {
  clients: { id: string; name: string; clientNumber: string }[];
  matters: { id: string; title: string; matterNumber: string }[];
  documents: { id: string; name: string; matterId: string | null }[];
};

export async function globalSearch(query: string): Promise<GlobalSearchResult> {
  const q = query.trim();
  if (q.length < 2) {
    return { clients: [], matters: [], documents: [] };
  }

  const [clients, matters, documents] = await Promise.all([
    prisma.client.findMany({
      where: { name: { contains: q } },
      take: 5,
      select: { id: true, name: true, clientNumber: true },
      orderBy: { name: "asc" },
    }),
    prisma.matter.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, matterNumber: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.documentFile.findMany({
      where: { name: { contains: q } },
      take: 5,
      select: { id: true, name: true, matterId: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { clients, matters, documents };
}
