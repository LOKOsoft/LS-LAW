import { prisma } from "@/lib/db/prisma";

export async function getClauses() {
  return prisma.clause.findMany({ orderBy: [{ isFavorite: "desc" }, { usageCount: "desc" }] });
}
export type ClauseItem = Awaited<ReturnType<typeof getClauses>>[number];

export async function getRecentlyUsedClauses(limit = 6) {
  return prisma.clause.findMany({ where: { lastUsedAt: { not: null } }, orderBy: { lastUsedAt: "desc" }, take: limit });
}

/** Resolves a clause's `relatedClauseIds` (comma-joined, same convention as `tags`) into real Clause records — clause relationships, not a separate join table, matching how `tags` is modeled elsewhere in this schema. */
export async function getRelatedClauses(clauseId: string) {
  const clause = await prisma.clause.findUnique({ where: { id: clauseId }, select: { relatedClauseIds: true } });
  const ids = clause?.relatedClauseIds?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (ids.length === 0) return [];
  return prisma.clause.findMany({ where: { id: { in: ids } } });
}
