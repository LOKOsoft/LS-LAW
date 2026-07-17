import { prisma } from "@/lib/db/prisma";

export async function getKnowledgeArticles() {
  return prisma.knowledgeArticle.findMany({
    where: { category: { not: "Case Law" } },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}
export type KnowledgeArticleItem = Awaited<ReturnType<typeof getKnowledgeArticles>>[number];

// Search predicate lives in `./search.ts` (no Prisma import) — see that file's
// comment for why: Client Components import it directly, and importing
// anything from this file drags Prisma/better-sqlite3 into the browser bundle.

/** Resolves an article's `relatedArticleIds` (comma-joined) into real records — cross-references between related articles/precedents. */
export async function getCrossReferences(articleId: string) {
  const article = await prisma.knowledgeArticle.findUnique({ where: { id: articleId }, select: { relatedArticleIds: true } });
  const ids = article?.relatedArticleIds?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (ids.length === 0) return [];
  return prisma.knowledgeArticle.findMany({ where: { id: { in: ids } }, include: { author: { select: { name: true } } } });
}
