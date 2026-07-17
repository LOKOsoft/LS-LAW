/**
 * Pure search predicate with zero server-only imports — safe to import into
 * a Client Component. Kept separate from `queries.ts` (which imports Prisma
 * at module scope) specifically so importing this one function doesn't drag
 * the Prisma/better-sqlite3 module graph into the browser bundle.
 */
export function matchesKnowledgeQuery(
  article: { title: string; summary?: string | null; body: string; tags?: string | null },
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [article.title, article.summary ?? "", article.body, article.tags ?? ""].some((field) => field.toLowerCase().includes(q));
}
