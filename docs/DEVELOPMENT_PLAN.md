# Development Plan

## Phase history

- **Phase 1 — Managing Partner** (`3324424`): initial build. Managing Partner role, core architecture (feature-based structure, shared `DataTable`, Prisma schema, design tokens) established.
- **PRD** (`c4cde15`): full Product Requirements Document added at `docs/PRD.md`.
- **V1.0** (`fc2d248`): real auth (scrypt password hashing, DB-backed sessions, `proxy.ts` + `requireUser()` guard), all remaining 11 staff personas + Client Portal, every module promoted from placeholder/tab to a real Prisma-backed module, role-scoped queries, live Settings (Users + permission matrix + Court List), Audit Logs, Attendance/Leaves with approval workflow, Analytics.

**Current state: V1.0 is a complete, working practice-management app** — not a scaffold. Every module listed in [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) has a real route, a real Prisma-backed query/action layer, and a real UI, for every role that should see it.

## This audit (foundation gap-fill pass)

A later request asked for a ground-up "foundation" build (design system, component library, layouts, hooks, utilities, services, providers) using a generic checklist. Since the foundation already existed and was real (not mock), that checklist was run as a **gap audit against the existing app**, not a rebuild:

**Written (didn't exist before):**
- `docs/INFORMATION_ARCHITECTURE.md`, `docs/DATABASE_ARCHITECTURE.md`, `docs/FOLDER_STRUCTURE.md`, `docs/ROUTE_MAP.md`, `docs/DESIGN_SYSTEM.md`, `docs/COMPONENT_LIBRARY.md` (this file's siblings) — the app had a PRD but no architecture/design docs.

**Added (genuine gaps found):**
- `src/hooks/` was empty despite `components.json` aliasing `@/hooks` — added `use-debounced-value`, `use-local-storage`, `use-media-query`, `use-disclosure`, `use-breadcrumbs`, `use-table-filters`.
- 8 table components (`clients`, `matters`, `hearings`, `audit-logs`, `clauses`, `hr/team`, `knowledge-base`, `templates`) each hand-rolled the identical search+status-filter `useState`/`useMemo` — refactored onto `use-table-filters`.
- `components/shared/multi-select.tsx`, `error-state.tsx`, `confirm-dialog.tsx`, `timeline.tsx` — requested UI patterns that had no equivalent (multi-select had no primitive at all; error/confirm/timeline had ad hoc or missing equivalents).
- `document-preview-drawer.tsx` rendered a static "preview not available" box despite `@react-pdf-viewer/core` + `@react-pdf-viewer/default-layout` being installed dependencies — wired a real `document-viewer.tsx`.
- The `Breadcrumb` UI primitive existed but nothing generated a breadcrumb trail anywhere — `use-breadcrumbs` closes the hook half of this gap; **wiring it into `PageHeader`/role layouts across all modules is follow-up work, not done in this pass** (would touch every page.tsx — out of scope for a foundation audit).

**Deliberately not built** (would have duplicated real, working functionality — see the "What does *not* exist (by design)" section of `FOLDER_STRUCTURE.md`):
- No parallel mock "service layer" — `features/<module>/{queries,actions}.ts` already is the real, Prisma-backed service layer.
- No new global Modal/Drawer/Notification/Settings providers — `providers.tsx` already covers Theme/Query/Tooltip/Toast; nothing in the app currently needs cross-tree modal triggering that would justify a global modal manager.
- No re-scaffold of components/layouts/dashboard widgets that already exist and work.

## Client Management completion pass

A prior session had started deepening the Clients module (new/edit forms split via `client-form-fields.tsx`, `merge-client-dialog.tsx`, `archived-clients-table.tsx`, `lib/csv.ts`, the `ARCHIVED` client status, and the corresponding `queries.ts`/`actions.ts`/`schema.ts` additions) but stopped mid-way: only `managing-partner`'s client detail page had the new Edit/Archive/Merge actions wired in, and `clients-table.tsx`'s own dropdown already linked to four sub-routes (`archived`, `duplicates`, `relationship-manager`, `import`) that didn't exist yet on disk for any role — those links would have 404'd. This pass finished it:

- Fixed a real `getArchivedClients` query bug (missing `title` on the `relationshipManager` select, breaking the shared `ClientListItem` type) and a generic-typing TS error in `client-form-fields.tsx`.
- Built `duplicate-detection-view.tsx`, `relationship-manager-view.tsx`, `import-clients-view.tsx`.
- Wired Edit/Archive/Merge actions into the 8 role detail pages that were missing them (`managing-partner` already had it; `accounts` deliberately stays read-only, matching its View-only tier).
- Added the 4 sub-routes for all 10 roles with a `clients` folder (38 new `page.tsx` files) — `accounts` only gets `archived`/`relationship-manager` (read-only), gated via a new `canManage`/`canRestore` prop on `ClientsTable`/`ArchivedClientsTable`.
- Added Print (`window.print()`) and Share (copy-link) buttons to `client-header.tsx`.
- Verified end-to-end with Playwright against the real dev server + seeded DB: login, list/search/export, full detail-tab sweep, actions menu, archived/duplicates/relationship-manager/import pages, a real create → duplicate-warning → merge round trip, and the accounts read-only gating (no Import/Duplicate-detection links, no Edit button, no Restore button, direct nav to `/accounts/clients/import` 404s as expected).
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` all clean (one pre-existing React Compiler warning on `new-client-form.tsx`'s `form.watch()`, unrelated to this pass).

## SaaS-readiness pass

A later request asked for the app to be prepared for a future commercial SaaS
version — auth, multi-tenancy, billing, cloud storage, notifications, AI,
config, logging, caching, error handling, and security — without implementing
any of those as real external integrations, and without breaking the "runs
fully locally, zero external services" constraint.

**Architecture audit first:** re-ran the checks this kind of request implies
(duplicate components/services, circular dependencies, oversized files, dead
code, naming) before adding anything. Result: clean. `npx madge --circular`
found 37 "circular dependencies," all internal to `src/generated/prisma`
(auto-generated, never hand-edited) — zero in app code. Largest source file
is 374 lines (`components/ui/chart.tsx`, a shadcn primitive). ESLint/tsc were
already clean apart from the one documented pre-existing warning. No changes
were needed or made as a result of the audit itself.

**Added — `src/lib/platform/`:** interface-driven scaffolding for auth/
permission/session contexts (wraps the real `lib/auth/*`, doesn't replace
it), multi-tenancy (resolves to the single seeded `Firm` today), billing/
subscriptions/feature-gating (fully mock — no real product billing existed
before), storage (wraps the real `lib/storage/local-storage.ts` behind a
`StorageProvider` interface; cloud adapters are inert), notifications
(wraps the real in-app `Notification` writer as one channel; email/SMS/
WhatsApp/push/desktop are console-logging mocks, disabled by default), AI
(fully mock, deterministic, no network calls), centralized config
(`lib/platform/config`), a logger (`lib/platform/logging`, operational —
distinct from the real `ActivityLog` audit trail), an in-memory cache
(`lib/platform/cache`), and a typed error hierarchy (`lib/platform/errors`).
See `src/lib/platform/README.md` for the module-by-module rules on what's
real vs. mock.

**Real, wired-in changes (not just scaffolding):**
- Security headers + a same-origin CSP via `next.config.ts`'s `headers()`
  (no nonces — that forces every page into dynamic rendering, a real
  behavior change this pass didn't want to make).
- `validateUploadedFile` (size limit, blocked executable extensions) wired
  into `app/api/upload/route.ts` — there was no upload validation before.
- An in-memory login rate limiter + security-event logging wired into
  `features/auth/actions.ts`'s `login()` — there was no brute-force
  throttling before.
- `lib/db/prisma.ts`'s DB file path is now overridable via
  `DATABASE_FILE_PATH` (falls back to the same `prisma/dev.db` as before) —
  added so integration tests can point at an isolated throwaway database;
  also generally useful for future deployment configurability.
- `@next/bundle-analyzer` wired in behind `ANALYZE=true` (`npm run analyze`).

**Added — `tests/` (didn't exist before this pass):** Vitest for unit +
integration tests, Playwright for e2e/accessibility/performance/visual, with
one real example per category (not placeholders — all verified passing
against the real dev server and a real isolated SQLite test database created
via `prisma db push` against a temp file). See `docs/TESTING.md`.

**Verified:** `npx tsc --noEmit`, `npm run lint`, `npm run test`, and the full
Playwright suite all pass; `npm run dev` serves `/login` and a real seeded
login → role-home flow end to end with zero external services configured.

**One environment quirk hit and resolved during verification, not a code
bug:** a stale Turbopack `.next` cache (see follow-up item 6 below on WSL2's
DrvFs filesystem-event unreliability) caused `/login` to 404 after rapid
dev-server restarts during testing; `rm -rf .next` before restarting fixed
it. Unrelated to any change in this pass.

## Known follow-up work (not done in this pass, intentionally out of scope)

1. Wire `use-breadcrumbs` into `PageHeader`/role layouts so breadcrumbs actually render (currently only the hook + primitive exist).
2. Consider whether `components/shared/charts/` should gain real shared wrapper components once a second chart type needs the same logic as an existing one — currently empty, and manufacturing an abstraction for a single caller would be premature.
3. Money fields are `Float` in Prisma — fine for a local single-tenant demo; would need `Decimal`/integer-minor-units before this app handled real currency amounts at scale.
4. Tag fields (`Client.tags`, `DocumentFile.tags`, etc.) are comma-joined strings, not a normalized `Tag` model — fine at current scale, revisit if tag-based filtering/analytics becomes a real requirement.
5. `@react-pdf-viewer/core`'s text-selection layer doesn't work against the installed `pdfjs-dist@6` (its peer range targets v2/v3) — PDFs render visually fine but their text isn't selectable/searchable in-preview. See the "Document viewing" section of `COMPONENT_LIBRARY.md` for the exact error and options to fix it properly (downgrade `pdfjs-dist`, or find/wait for a `@react-pdf-viewer` build targeting v6+).
6. This project's dev server occasionally needs a manual restart to pick up newly created files — WSL2's DrvFs (`/mnt/d/...`) doesn't reliably deliver inotify events for file creation, and `next dev` itself logged "Slow filesystem detected" during this audit. Editing existing files hot-reloads fine; adding new files may not until the next restart. Not fixable from the app side — either move the working tree to a native Linux path, or restart `next dev` after adding files it doesn't seem to pick up.

## Working agreement for future modules

Follow `FOLDER_STRUCTURE.md`'s "Rules for adding a new module" exactly: `features/<module>/queries.ts` → `components/<module>/*` → `app/(roles)/<role>/<module>/page.tsx` → register in `nav.ts`/`permission-matrix.ts`. Reuse `components/shared/*` and `src/hooks/*` before writing new one-off logic — check `COMPONENT_LIBRARY.md` first.
