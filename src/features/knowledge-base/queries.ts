import { prisma } from "@/lib/db/prisma";

export async function getKnowledgeArticles() {
  return prisma.knowledgeArticle.findMany({
    where: { category: { not: "Case Law" } },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}
export type KnowledgeArticleItem = Awaited<ReturnType<typeof getKnowledgeArticles>>[number];
