# Legal Knowledge Engine

Two real, Prisma-backed modules share one underlying model
(`KnowledgeArticle`): the **Knowledge Base** (`features/knowledge-base/`,
internal guidelines/notes/opinions) and **Research**
(`features/research/`, case law) — filtered by `category` (`"Case Law"` vs.
everything else). Both were real before this phase; this phase added
cross-references, broader search, and a research notebook/bookmarking layer.

## Repository

`KnowledgeArticle`: `title`, `category`, `summary`, `body`, `tags`,
`authorId`, `publishedAt`, `viewCount`. Legal notes, research references,
"legal opinions," and "internal guidelines" are all represented as
articles distinguished by `category` — there's no separate model per
content type, matching this schema's existing convention of one flexible
model rather than a model per sub-type (see `DATABASE_ARCHITECTURE.md`'s
"Free-text tags" note for the same pattern elsewhere).

## Cross-references (new this phase)

`relatedArticleIds` (comma-joined, same convention as `tags`) +
`getCrossReferences(articleId)` in `features/knowledge-base/queries.ts`
resolves it to real `KnowledgeArticle` records. Not wired into any UI yet —
backend only; see "Follow-up" below.

## Search

Previously title-only. `matchesKnowledgeQuery()` now matches title,
summary, body, and tags — every article is genuinely searchable, not just
by its headline. This function lives in its own file,
`features/knowledge-base/search.ts`, deliberately separate from
`queries.ts` (which imports Prisma) — **see the note below, this separation
matters for correctness, not just style.**

### Why `search.ts` is a separate file (a real bug this phase fixed)

`knowledge-base-table.tsx` is a Client Component. Importing a real
(non-type) function from a file that also imports Prisma at module scope —
even a function that itself never touches Prisma — drags the whole module
graph (including `better-sqlite3`, a native Node addon) into the browser
bundle. This isn't hypothetical: it broke `next dev` with a hard
`Module not found: Can't resolve 'fs'` chunking error during this phase's
own verification, for exactly this reason in `document-generator`'s
equivalent case (see `docs/TESTING.md`'s note and
`features/document-generator/actions.ts`'s `getGeneratedDocumentDetail`
Server Action, added for the same reason). Pure client-safe helpers now
live in files with zero server-only imports; anything that needs Prisma is
called via a Server Action, never a direct `queries.ts` import, from
Client Component code.

## Legal Research Assistant (Step 8)

New real models: `ResearchBookmark` (unique per user+article) and
`ResearchNote` (free-form, optionally tied to an article and/or a matter).
Backend in `features/research/actions.ts` (`toggleResearchBookmark`,
`addResearchNote`, `deleteResearchNote`) and `features/research/queries.ts`
(`getBookmarkedArticles`, `getBookmarkedArticleIds`, `getResearchNotes`).

The research notebook doubles as research history — every note is
timestamped, so `getResearchNotes()` ordered by `createdAt` already *is* a
chronological research history; no separate history table was added.

**Case search** stays fully mock — see
`lib/platform/legal-research/providers.ts`'s `MockCaseSearchProvider`
(returns an empty result set, deliberately — fabricating case law results
would be actively harmful) plus named placeholders
(`IndianKanoonAdapterPlaceholder`, `SccOnlineAdapterPlaceholder`) for where
a real Indian legal-database integration would plug in. A `CaseSearchQueryBuilder`
(`lib/platform/legal-research/query-builder.ts`) demonstrates the
structured-query-building capability the request asked for. See
docs/FUTURE_INTEGRATIONS.md.

## Follow-up (not built this phase)

Cross-references and the bookmark/notebook backend have no UI wired in yet
— building bookmark-star UI into `KnowledgeBaseTable` would mean threading
"current user's bookmarked article ids" through ~20 role page.tsx files
(both `knowledge-base` and `research` routes reuse the same table
component across ~10 roles each). Given the scope of everything else in
this phase, that UI wiring was scoped out as real, well-defined follow-up
work rather than attempted partially.
