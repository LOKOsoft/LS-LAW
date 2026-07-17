import { prisma } from "@/lib/db/prisma";

export async function getResearchArticles() {
  return prisma.knowledgeArticle.findMany({
    where: { category: "Case Law" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}
export type ResearchArticleItem = Awaited<ReturnType<typeof getResearchArticles>>[number];

/** A user's bookmarked research/knowledge articles — the "Bookmarking" capability of the Legal Research Assistant (Step 8). */
export async function getBookmarkedArticles(userId: string) {
  return prisma.researchBookmark.findMany({
    where: { userId },
    include: { article: { include: { author: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookmarkedArticleIds(userId: string): Promise<Set<string>> {
  const bookmarks = await prisma.researchBookmark.findMany({ where: { userId }, select: { articleId: true } });
  return new Set(bookmarks.map((b) => b.articleId));
}

/** A user's research notebook — free-form notes, optionally tied to an article or a matter. The "Research notebook" + "Research history" capability of the Legal Research Assistant (Step 8): the notebook itself doubles as a chronological history of what was researched, since every note is timestamped. */
export async function getResearchNotes(userId: string) {
  return prisma.researchNote.findMany({
    where: { userId },
    include: { article: { select: { title: true } }, matter: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}
export type ResearchNoteItem = Awaited<ReturnType<typeof getResearchNotes>>[number];
