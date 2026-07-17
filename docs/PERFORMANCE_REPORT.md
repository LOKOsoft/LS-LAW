# Performance Report

Snapshot as of this release. See `docs/PERFORMANCE.md` for the original
narrative from the SaaS-readiness pass — this file adds what changed/was
verified in this production-readiness pass.

## Verified this release

- **Production build**: clean, `next build` compiles successfully, all
  244 routes generate without error.
- **React Compiler auto-memoization** confirmed still active (the
  `react-hooks/incompatible-library` ESLint warning on
  `new-client-form.tsx` only fires when the compiler is analyzing a
  component — its presence confirms the compiler runs project-wide).
  Manual `useMemo`/`useCallback`/`React.memo` remains unnecessary by
  default; not added anywhere this release.
- **Radix Tabs** confirmed to unmount inactive tab panels by default (no
  `forceMount`) — the newly-added "Risks" and "Assistant" tabs on the
  matter detail page don't cost anything when not selected.
- **DataTable pagination** confirmed still bounds every list view (default
  page size 10) — no unbounded row rendering anywhere, so virtual
  scrolling remains unnecessary at current data scale (unchanged
  conclusion from the prior report).
- **Dynamic import** for the PDF viewer (`ssr: false`, browser-only
  `pdfjs-dist`) confirmed still correct and unchanged.
- **Bundle analyzer** (`npm run analyze`) still wired in behind
  `ANALYZE=true`.

## New in this release

- **Document Comparison Engine** (`compareDocumentVersions`) is an
  O(n·m) LCS diff — fine for legal-document-sized text (hundreds of
  lines), not designed for comparing very large documents. No performance
  issue observed; noted for awareness if a future use case needs to diff
  much larger texts.
- **Risk Analysis Engine**: `getMatterRisks()` runs 7 parallel,
  projection-scoped Prisma queries per matter — efficient, no N+1.
  `getFirmWideRisks()` (not wired into any UI yet) calls `getMatterRisks()`
  once per active matter via `Promise.all` — for a firm with many active
  matters this means many small parallel query batches rather than a
  handful of batched `IN (...)` queries. **Not yet a real bottleneck**
  (unused in the UI), but flagged here as the first thing to optimize
  (batch by model instead of by matter) before wiring it into a firm-wide
  dashboard.
- **Color token change**: darkening `--muted-foreground` (accessibility
  fix, see `docs/UI_GUIDELINES.md`) has no performance implication — pure
  CSS custom property value change, zero new runtime work.

## Real page-load measurement

`tests/performance/login.spec.ts` asserts the login page responds within
5 seconds (a coarse regression budget, not a micro-benchmark) — currently
passing at ~200ms in local dev-mode testing after initial route
compilation. Extending performance budgets to authenticated pages
(dashboard, matters list) is reasonable follow-up work once there's a
production (not dev-mode) environment to measure against — dev-mode
Turbopack's on-demand compilation makes first-hit timing misleading (see
`docs/TESTING.md`'s note on this).

## Recommendation

No urgent performance work outstanding. The one identified future
optimization (`getFirmWideRisks()` batching) should happen at the same
time it's actually wired into a UI, not speculatively now.
