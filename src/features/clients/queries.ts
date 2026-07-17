import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getClients(options?: { scopeUserId?: string; includeArchived?: boolean }) {
  const scopeFilter = options?.scopeUserId
    ? {
        OR: [
          { relationshipManagerId: options.scopeUserId },
          { matters: { some: matterScopeFilter(options.scopeUserId) } },
        ],
      }
    : {};

  return prisma.client.findMany({
    where: {
      ...scopeFilter,
      status: options?.includeArchived ? undefined : { not: "ARCHIVED" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      relationshipManager: { select: { name: true, title: true } },
      _count: { select: { matters: true, invoices: true } },
    },
  });
}

export type ClientListItem = Awaited<ReturnType<typeof getClients>>[number];

export async function getArchivedClients(options?: { scopeUserId?: string }) {
  const scopeFilter = options?.scopeUserId
    ? {
        OR: [
          { relationshipManagerId: options.scopeUserId },
          { matters: { some: matterScopeFilter(options.scopeUserId) } },
        ],
      }
    : {};

  return prisma.client.findMany({
    where: { ...scopeFilter, status: "ARCHIVED" },
    orderBy: { updatedAt: "desc" },
    include: {
      relationshipManager: { select: { name: true, title: true } },
      _count: { select: { matters: true, invoices: true } },
    },
  });
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      relationshipManager: { select: { id: true, name: true, title: true, email: true, avatarUrl: true } },
      matters: {
        include: { practiceArea: true, responsibleAttorney: { select: { name: true } } },
        orderBy: { openedDate: "desc" },
      },
      invoices: { orderBy: { issueDate: "desc" }, take: 20 },
      documents: { orderBy: { createdAt: "desc" }, take: 20, include: { uploadedBy: { select: { name: true } } } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
      meetings: { orderBy: { scheduledAt: "desc" } },
      communicationLogs: { orderBy: { occurredAt: "desc" }, include: { loggedBy: { select: { name: true } } } },
      retainers: true,
    },
  });
}

export type ClientDetail = NonNullable<Awaited<ReturnType<typeof getClientById>>>;

export async function isClientInScope(clientId: string, scopeUserId: string) {
  const count = await prisma.client.count({
    where: {
      id: clientId,
      OR: [{ relationshipManagerId: scopeUserId }, { matters: { some: matterScopeFilter(scopeUserId) } }],
    },
  });
  return count > 0;
}

export async function getRelationshipManagerOptions() {
  return prisma.user.findMany({
    where: { role: { in: ["MANAGING_PARTNER", "SENIOR_PARTNER", "PARTNER", "ASSOCIATE", "JUNIOR_ASSOCIATE"] } },
    select: { id: true, name: true, title: true },
    orderBy: { name: "asc" },
  });
}

export function normalizeClientName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function findSimilarClients(name: string, excludeId?: string) {
  const normalized = normalizeClientName(name);
  if (normalized.length < 2) return [];

  const clients = await prisma.client.findMany({
    where: { status: { not: "ARCHIVED" }, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true, name: true, clientNumber: true, email: true, phone: true, industry: true },
  });

  return clients.filter((c) => normalizeClientName(c.name) === normalized);
}

export type DuplicateClientGroup = {
  key: string;
  reason: "name" | "email" | "phone";
  clients: ClientListItem[];
};

export async function getDuplicateClientGroups(): Promise<DuplicateClientGroup[]> {
  const clients = await getClients();
  const groups: DuplicateClientGroup[] = [];
  const seenPairKeys = new Set<string>();

  function addGroups(keyOf: (c: ClientListItem) => string | null, reason: DuplicateClientGroup["reason"]) {
    const byKey = new Map<string, ClientListItem[]>();
    for (const client of clients) {
      const key = keyOf(client);
      if (!key) continue;
      const bucket = byKey.get(key) ?? [];
      bucket.push(client);
      byKey.set(key, bucket);
    }
    for (const [key, bucket] of byKey) {
      if (bucket.length < 2) continue;
      const pairKey = `${reason}:${bucket.map((c) => c.id).sort().join(",")}`;
      if (seenPairKeys.has(pairKey)) continue;
      seenPairKeys.add(pairKey);
      groups.push({ key, reason, clients: bucket });
    }
  }

  addGroups((c) => normalizeClientName(c.name), "name");
  addGroups((c) => c.email?.toLowerCase().trim() || null, "email");
  addGroups((c) => c.phone?.replace(/\D/g, "") || null, "phone");

  return groups;
}

export type RelationshipManagerGroup = {
  manager: { id: string; name: string; title: string | null } | null;
  clients: ClientListItem[];
};

export async function getRelationshipManagerRoster(options?: { scopeUserId?: string }): Promise<RelationshipManagerGroup[]> {
  const clients = await getClients({ scopeUserId: options?.scopeUserId, includeArchived: false });
  const byManager = new Map<string, RelationshipManagerGroup>();

  for (const client of clients) {
    const key = client.relationshipManagerId ?? "unassigned";
    if (!byManager.has(key)) {
      byManager.set(key, {
        manager: client.relationshipManagerId
          ? {
              id: client.relationshipManagerId,
              name: client.relationshipManager?.name ?? "Unknown",
              title: client.relationshipManager?.title ?? null,
            }
          : null,
        clients: [],
      });
    }
    byManager.get(key)!.clients.push(client);
  }

  return Array.from(byManager.values()).sort((a, b) => b.clients.length - a.clients.length);
}

export async function getClientActivityLog(clientId: string, limit = 100) {
  return prisma.activityLog.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { name: true, role: true } } },
  });
}

export type ClientActivityItem = Awaited<ReturnType<typeof getClientActivityLog>>[number];
