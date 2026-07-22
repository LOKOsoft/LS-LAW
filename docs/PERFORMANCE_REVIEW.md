# Performance Review

Re-verified this pass, after the database-indexing work
(`docs/DATABASE_REVIEW.md`) already closed the FK-index gap — findings
below are what remains, checked directly against the code.

## N+1 query patterns

Most query files are correctly batched (`Promise.all` + `include`/
`select`, single round trip) — e.g. `matters/queries.ts`'s `getMatterById`,
`dashboard/queries.ts`'s `getTodaysSchedule`. Three real N+1 patterns
found:

- `dashboard/queries.ts`'s `getTeamUtilization()` — one
  `timeEntry.aggregate` per fee-earner inside a `.map()` (parallelized via
  `Promise.all`, so not slow in wall-clock terms, but still N queries
  instead of one `groupBy`).
- `reports/queries.ts`'s `getReportsData()` — same pattern, 2N queries
  (one `matter.aggregate` + one `timeEntry.aggregate` per attorney).
- `risk/queries.ts`'s `getFirmWideRisks()` — genuinely unbatched: N
  matters × 7 queries each via `getMatterRisks()`. **Confirmed not called
  anywhere in the app** (only a comment reference in
  `matter-risks-panel.tsx` and the function's own doc comment noting it's
  unwired) — a real latent N+1 landmine, but inert today, not a live
  performance bug.

All three are mechanical fixes (`groupBy` instead of per-entity
`.map()`), logged in `docs/TECHNICAL_DEBT.md` as Low priority precisely
because two are already parallelized and the third is dead code — none
are causing a slow page today.

## Pagination coverage

Only 9 of 80+ `findMany`-containing query files paginate
(`take`/`skip`) — correctly done in `activity`, `audit-logs`,
`notifications`. **Unbounded, firm-wide fetches** on tables that will grow
large over real usage: `billing/queries.ts`'s `getInvoices`,
`getPayments`, `getExpenses`, `getRetainers`, `getUnbilledTimeByMatter`,
and `documents/queries.ts`'s `getDocuments`, `tasks/queries.ts`'s
`getTasks`. None of these are broken today (dataset sizes are small in
any real single-firm deployment so far), but they're the correct next
target once any of these tables reaches thousands of rows — this is the
same shape of finding as the index gap was, just not yet acute. Logged as
Medium priority in `docs/TECHNICAL_DEBT.md`.

## Client-bundle weight

73% of `.tsx` files under `components/` are Client Components — expected
for an interaction-heavy practice-management UI, not itself a problem.
**Real finding**: 7 components import `recharts` directly with no
`next/dynamic` lazy-loading (`analytics-view.tsx`, `billing-summary.tsx`,
3 dashboard chart components, `finance-overview.tsx`, `reports-view.tsx`,
plus the shared `ui/chart.tsx` wrapper) — full chart-library bundle ships
to every page that renders one, even above the fold before the user
scrolls to a chart. The app already has the right pattern in hand:
`document-preview-drawer.tsx` correctly lazy-loads its PDF viewer via
`next/dynamic` — the same treatment just hasn't been applied to charts
yet. Logged as Medium priority, low-effort (wrap each chart import,
established pattern to copy).

## Caching

`lib/platform/cache/` (`MemoryCacheProvider`, `BrowserCacheProvider`,
namespace exports `queryCache`/`searchCache`/`reportCache`) is fully built
but **zero real call sites** — confirmed via grep, matching the module's
own doc comment. This is consistent with the platform layer's stated
design (interface-ready, not wired until there's a real performance
requirement to justify it) rather than an oversight — no page today is
slow enough to need it. `revalidatePath("/", "layout")` is used ~30 times
across mutation actions — correct but coarse (whole-layout invalidation on
every write rather than scoped path/tag revalidation); worth narrowing
once the app has enough traffic for cache-invalidation cost to matter, not
before.

## Search/filter performance

`global-search.tsx` debounces via a manual 200ms `setTimeout` (not the
shared `useDebouncedValue` hook, which exists but is only consumed by one
other component) — functionally correct, just an inconsistency worth
converging on the shared hook for maintainability, not a performance bug.
`search/actions.ts` runs 9 parallel bounded (`take: 5`) queries per
search — reasonable for current data volume; `LIKE %x%` on SQLite doesn't
use an index regardless of table size, which is a real ceiling if search
tables grow very large, but not addressable by indexing alone (would need
FTS5 or similar) — noted as a future item, not urgent today.

## Score

**83/100.** Slightly below the prior pass's 84 despite the index fix,
because this review found real (if currently low-impact) N+1 and
unbounded-query patterns that hadn't been previously enumerated — the
score reflects more complete visibility, not a regression. Everything
found is mechanical and bounded (groupBy conversions, take/skip additions,
dynamic imports for 7 chart components) rather than requiring
architecture change. See `docs/TECHNICAL_DEBT.md` for the itemized,
prioritized list.
