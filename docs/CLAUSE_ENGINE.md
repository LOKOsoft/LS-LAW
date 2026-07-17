# Clause Engine

`src/features/clauses/` — the real, Prisma-backed `Clause` model, extended
in this phase (not a new mock layer; see `lib/platform/README.md`'s
distinction between real features and future-capability scaffolding).

## Schema (`prisma/schema.prisma`)

```
model Clause {
  title, category, body, tags          // pre-existing
  jurisdiction, language, riskLevel     // added this phase
  relatedClauseIds                      // added this phase
  isFavorite, usageCount, lastUsedAt    // isFavorite/usageCount pre-existing; lastUsedAt added
}
enum ClauseRiskLevel { LOW, MEDIUM, HIGH }
```

- **Categories** — the pre-existing free-text `category` field (e.g.
  "Confidentiality", "Termination"); filterable in the UI.
- **Tags** — pre-existing comma-joined `tags`, same convention as
  `Client.tags`/`DocumentFile.tags` elsewhere in this schema.
- **Jurisdiction / Language** — new nullable/defaulted fields; `language`
  defaults to `"en"`.
- **Risk Level** — new `ClauseRiskLevel` enum (LOW/MEDIUM/HIGH), rendered
  via `RiskSeverityPill` (shared with the Risk Analysis Engine's severity
  display — one pill component, not two).
- **Clause relationships** — `relatedClauseIds` is comma-joined Clause ids,
  the same modeling convention as `tags` (not a join table — consistent
  with how this schema already treats free-text multi-value fields).
  Resolved to real records via `getRelatedClauses(clauseId)`.
- **Versions** — not a separate `ClauseVersion` history table; out of scope
  for this pass (would mirror the `DocumentFile`/`DocumentVersion` pattern
  if a real requirement for clause edit history emerges).

## Queries & actions (`features/clauses/`)

- `getClauses()` — all clauses, favorites-then-usage sorted.
- `getRecentlyUsedClauses(limit)` — ordered by `lastUsedAt`.
- `getRelatedClauses(clauseId)` — resolves relationships.
- `toggleClauseFavorite(id, isFavorite)` — pre-existing.
- `recordClauseUsage(id)` — **new**: bumps `usageCount` + `lastUsedAt`. There
  was no usage-tracking action before this phase — `usageCount` existed in
  the schema but nothing ever incremented it.

## UI (`components/clauses/clauses-table.tsx`)

Real, working table (search + category filter + favorite toggle
pre-existing) extended with: a Jurisdiction column, a Risk severity badge,
and a "Use" button that copies the clause body to the clipboard and calls
`recordClauseUsage()` — the first real "use this clause" interaction in the
app; previously `usageCount` was display-only.

## Search

Client-side, via the existing `useTableFilters` hook — searches `title`.
Broadening to body/tags (matching the Knowledge Engine's approach — see
docs/KNOWLEDGE_ENGINE.md) is a reasonable follow-up if clause bodies get
long enough that title-only search stops being sufficient.

## Recommendations (AI-adjacent, mock)

`lib/platform/ai/prompt/templates.ts`'s `clause.recommend` prompt template
+ `MockAIProvider.recommend()` / `AIProvider.recommend()` cover
"recommend a clause for this drafting context" — currently a single canned
suggestion, not a real recommendation engine. See docs/AI_ARCHITECTURE.md.
