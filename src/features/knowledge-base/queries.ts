import { prisma } from "@/lib/db/prisma";

export async function getKnowledgeArticles() {
  return prisma.knowledgeArticle.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}
export type KnowledgeArticleItem = Awaited<ReturnType<typeof getKnowledgeArticles>>[number];
