import { prisma } from "@/lib/db/prisma";

export async function getResearchArticles() {
  return prisma.knowledgeArticle.findMany({
    where: { category: "Case Law" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}
export type ResearchArticleItem = Awaited<ReturnType<typeof getResearchArticles>>[number];
