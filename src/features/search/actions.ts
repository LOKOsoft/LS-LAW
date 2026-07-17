"use server";

import { prisma } from "@/lib/db/prisma";

export type GlobalSearchResult = {
  clients: { id: string; name: string; clientNumber: string }[];
  matters: { id: string; title: string; matterNumber: string }[];
  documents: { id: string; name: string; matterId: string | null }[];
  hearings: { id: string; hearingType: string; courtName: string; matterId: string }[];
  invoices: { id: string; invoiceNumber: string; matterId: string | null }[];
  tasks: { id: string; title: string; matterId: string | null }[];
  notes: { id: string; body: string; matterId: string | null; clientId: string | null }[];
  employees: { id: string; name: string; role: string }[];
  companies: { id: string; name: string }[];
};

const EMPTY_RESULT: GlobalSearchResult = {
  clients: [],
  matters: [],
  documents: [],
  hearings: [],
  invoices: [],
  tasks: [],
  notes: [],
  employees: [],
  companies: [],
};

export async function globalSearch(query: string): Promise<GlobalSearchResult> {
  const q = query.trim();
  if (q.length < 2) {
    return EMPTY_RESULT;
  }

  const [clients, matters, documents, hearings, invoices, tasks, notes, employees, companies] = await Promise.all([
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
    prisma.hearing.findMany({
      where: { OR: [{ courtName: { contains: q } }, { hearingType: { contains: q } }, { judge: { contains: q } }] },
      take: 5,
      select: { id: true, hearingType: true, courtName: true, matterId: true },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { invoiceNumber: { contains: q } },
      take: 5,
      select: { id: true, invoiceNumber: true, matterId: true },
      orderBy: { issueDate: "desc" },
    }),
    prisma.task.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, matterId: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.note.findMany({
      where: { body: { contains: q } },
      take: 5,
      select: { id: true, body: true, matterId: true, clientId: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { name: { contains: q }, role: { not: "CLIENT" } },
      take: 5,
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    }),
    prisma.company.findMany({
      where: { name: { contains: q } },
      take: 5,
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { clients, matters, documents, hearings, invoices, tasks, notes, employees, companies };
}
