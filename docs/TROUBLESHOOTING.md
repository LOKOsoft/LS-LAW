# Troubleshooting

Real issues hit during this project's development, and how they were
actually resolved — not hypothetical FAQ entries.

## `next dev` serves a 404 for a page that definitely exists

**Symptom:** A route that works fine normally suddenly 404s, especially
right after several rapid dev-server restarts.

**Cause:** Turbopack's `.next` dev cache going stale on WSL2's DrvFs
filesystem (`/mnt/d/...` paths) — a documented, environment-specific
quirk, not a code bug. `next dev` itself sometimes logs "Slow filesystem
detected" in this environment.

**Fix:**
```bash
rm -rf .next
npm run dev
```

## Dev server logs a `ChunkLoadError` / `Module not found: Can't resolve 'fs'`

**Symptom:** The dev server throws a chunking/module-resolution error
mentioning a Node built-in (`fs`, `net`, etc.) or a native addon
(`better-sqlite3`) while compiling a Client Component.

**Cause:** A Client Component (`"use client"`) imported a **real**
(non-`type`) function from a module that also imports Prisma at module
scope — even if the specific function never touches Prisma itself,
importing anything from that file drags the whole module graph
(including `better-sqlite3`, a native Node addon that can't run in a
browser) into the client bundle. **This will build successfully with
`next build`** and only fail at dev-mode runtime — a production build
alone does not prove this isn't happening.

This happened twice in this project's history — once in the Document
Generator module, once in the Knowledge Base module (search predicate).

**Fix:** Move the function into a file with zero server-only imports (see
`features/knowledge-base/search.ts`), or if the Client Component
genuinely needs server-only data, add a thin Server Action wrapper (see
`features/document-generator/actions.ts`'s `getGeneratedDocumentDetail`).
Never import a real function from a `queries.ts`-style file into a
Client Component — only `import type`.

**Prevention:** `grep -rn "^import.*from \"@/features/.*/queries\"" src/components --include="*.tsx" | grep -v "import type"` —
should return nothing. Run this after adding any new client-side data
fetching.

## Playwright's `webServer` times out waiting for the dev server

**Symptom:** `Error: Timed out waiting 60000ms from config.webServer.`

**Cause:** Usually the same stale `.next` cache issue above, sometimes
combined with a lingering `next dev` process from a previous test run
still holding the port.

**Fix:**
```bash
pgrep -af "next dev"        # check for a lingering process; kill by PID if found
rm -rf .next
npx playwright test ...      # retry
```

## A newly-created file doesn't seem to be picked up by the dev server

**Cause:** WSL2's DrvFs doesn't reliably deliver filesystem-event
notifications for file *creation* (editing existing files hot-reloads
fine). Not fixable from the app side.

**Fix:** Restart `next dev` after adding new files it doesn't seem to
notice.

## `npx tsc --noEmit` reports errors in `.next/dev/types/validator.ts`

**Cause:** A stale/corrupted Next.js-generated type-checking artifact,
usually from an interrupted or killed dev server process.

**Fix:** `rm -rf .next` and re-run — this is never a real code error if
the reported file lives under `.next/`.

## An accessibility test fails with a very low contrast ratio that doesn't match the visible design

**Cause:** Likely caught the page mid-animation (e.g. `framer-motion`
entrance fade) — axe measures whatever opacity is actually rendered at
scan time, and a partially-transparent element genuinely does have low
contrast at that instant even though the settled design is fine.

**Fix:** Add a short wait (`page.waitForTimeout(...)`) after navigation,
before calling `axe.analyze()`, long enough for entrance animations to
finish. See `tests/accessibility/dashboard.spec.ts`'s comment for the
real example.

## PDF preview renders but text isn't selectable

**Cause:** `@react-pdf-viewer/core`'s text-selection layer targets
`pdfjs-dist` v2/v3; this project has `pdfjs-dist@6`. Visual rendering
works; text selection/search-in-PDF doesn't.

**Fix:** None applied yet — options are downgrading `pdfjs-dist` or
waiting for a `@react-pdf-viewer` release targeting v6+. See
`docs/COMPONENT_LIBRARY.md`.
