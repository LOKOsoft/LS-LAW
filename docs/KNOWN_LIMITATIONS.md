# Known Limitations

Honest, current-as-of-this-release list. See each linked doc for full
context — this file is the index, not the explanation.

## Architecture / scale

- **Single-tenant.** One `Firm` row; no data isolation between firms. See
  `docs/ARCHITECTURE_DECISIONS.md`'s entry on multi-tenancy for the
  planned shared-schema + `firmId` approach.
- **SQLite, single process.** Fine for one firm on one server; does not
  support horizontal scaling. See `docs/DEPLOYMENT_GUIDE.md`.
- **Money is `Float`, not `Decimal`.** Fine at local/demo scale; would
  need revisiting (`Decimal` + integer minor-units) before handling real
  currency amounts at production scale.
- **Tags are comma-joined strings**, not a normalized `Tag` model —
  fine at current scale, revisit if tag-based filtering/analytics becomes
  a real requirement.
- **In-memory rate limiter and cache** reset on process restart and
  aren't shared across instances — fine for one process, need a
  Redis-backed replacement before running more than one instance.

## AI capabilities

- **Every AI capability is mock except a real-if-configured local Ollama
  path.** No cloud AI provider is connected anywhere (by design — see
  `docs/AI_ARCHITECTURE.md`). Semantic search, OCR, NER, and legal case
  search are all deterministic mocks/heuristics, not real ML.
- **Document generation has no clause-library injection.** The generator
  is self-contained; it doesn't pull matching clauses from the Clause
  Library into generated text yet.
- **Document comparison only works on `GeneratedDocument` text.**
  Comparing two versions of an arbitrary uploaded file (Word/PDF) would
  need real OCR/text-extraction first, which stays mock. See
  `docs/DOCUMENT_ANALYSIS.md`.
- **"Overdue compliance activities"** (Risk Analysis Engine) is a proxy
  over generic overdue `Task` records — there's no dedicated Compliance
  model.

## UI / UX

- **Research bookmark/notebook backend has no UI wired in yet** — real,
  tested, but not exposed in any screen (would need threading
  "current user's bookmarked ids" through ~20 role page files that reuse
  the shared knowledge-base table). See `docs/KNOWLEDGE_ENGINE.md`.
- **Breadcrumbs**: the `useBreadcrumbs` hook and `Breadcrumb` primitive
  both exist but aren't wired into any page header yet.
- **PDF text isn't selectable/searchable in-preview** — a peer-version
  mismatch between `@react-pdf-viewer/core` and the installed
  `pdfjs-dist@6`; PDFs render visually fine. See `docs/COMPONENT_LIBRARY.md`.
- **`getFirmWideRisks()` isn't wired into any dashboard** — the query
  exists and works but currently does one round of sub-queries per active
  matter; would benefit from batching before use in a high-matter-count
  firm-wide view. See `docs/PERFORMANCE_REPORT.md`.

## Environment

- **WSL2 `.next` cache instability**: Turbopack's dev cache can go stale
  after rapid restarts on WSL2's DrvFs filesystem, occasionally causing a
  route to 404 or a chunk-load error until `.next` is cleared. Not a code
  bug. See `docs/TROUBLESHOOTING.md`.
- **This project's dev server sometimes needs a manual restart** to pick
  up newly *created* files (not edits to existing files) — a WSL2
  filesystem-event limitation, not fixable from the app side.

## Testing

- **No CI pipeline** runs the test suite automatically yet — all test
  commands are local-only today. See `docs/TESTING.md`.
- Visual regression coverage is limited to the login page; expanding it
  to authenticated pages is real follow-up work (screenshots of
  role-specific dashboards would need per-role baselines).
