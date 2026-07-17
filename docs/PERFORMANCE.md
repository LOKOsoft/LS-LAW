# Performance

## Memoization strategy: compiler-driven, not manual

This Next.js version runs the React Compiler by default (visible via the
`react-hooks/incompatible-library` ESLint warning on `new-client-form.tsx`'s
`form.watch()` — that warning only fires when the compiler is analyzing a
component for auto-memoization). This means most components are
automatically memoized at build time; hand-adding `useMemo`/`useCallback`/
`React.memo` everywhere would be redundant at best and can defeat the
compiler's own memoization in some cases. Don't reach for manual
memoization by default — only add it where a profiler actually shows a
component re-rendering expensively despite the compiler (rare, and not
observed anywhere in this codebase during this pass).

## Code splitting / lazy loading already in place

- `components/documents/document-preview-drawer.tsx` dynamically imports
  `document-viewer.tsx` with `ssr: false` — `pdfjs-dist` touches
  browser-only globals (`DOMMatrix`) at module-evaluation time and would
  crash SSR otherwise. This was already correct before this pass; verified,
  not changed.
- Next's App Router already code-splits per route (`app/(roles)/<role>/<module>/page.tsx`)
  — each role/module combination only ships the JS it needs.

## Bundle analysis

`npm run analyze` runs a production build with `@next/bundle-analyzer`
enabled (`ANALYZE=true`), opening an interactive treemap of what's in each
chunk. Added in this pass — wasn't available before. Use it before adding a
new heavy dependency (a second chart library, a rich text editor, etc.) to
see the actual cost.

## Image handling

`components/documents/document-viewer.tsx` intentionally uses a plain
`<img>` tag (with an explicit `eslint-disable` comment) instead of
`next/image` for previewing arbitrary uploaded files — the file's dimensions
aren't known at build time and it's a bounded thumbnail preview, not a
full-bleed responsive image, so `next/image`'s optimization pipeline
wouldn't add value here. Left as-is; this was already a deliberate decision
from an earlier pass, not something this pass changed.

## Virtualization

Every list view goes through the shared `DataTable`
(`components/shared/data-table/`), which paginates rather than rendering
unbounded rows — no view currently renders large enough lists (hundreds to
low thousands of rows at most, per the seeded demo data's scale) to need
virtual scrolling on top of that. Revisit if a module's row count grows into
the tens of thousands and pagination alone isn't enough (e.g. an
export-heavy Reports view).

## Caching

`src/lib/platform/cache/` provides `MemoryCacheProvider` (TTL-based,
in-process) plus separate `queryCache`/`searchCache`/`reportCache`
namespaces — available, not wired into any query by default. Every query
currently hits Prisma directly; that's correct for a local single-user app
where staleness would be a worse trade-off than the (already fast) SQLite
read. Opt a specific expensive, rarely-changing query into one of these
namespaces if profiling ever shows it's worth the staleness trade-off — see
`src/lib/platform/README.md`'s caching row for the "what's real vs. mock"
summary.

## Verified

`npx tsc --noEmit` and `npm run lint` clean; `npm run dev` serves `/login`
and a seeded login → role-home flow with no unexpected multi-second waits
beyond Next dev mode's normal first-hit route compilation (Turbopack compiles
each route tree lazily on first request in dev — this is expected and not a
production behavior; see `docs/TESTING.md`'s note on Playwright timeouts).
