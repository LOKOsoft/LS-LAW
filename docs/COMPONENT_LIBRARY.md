# Component Library

Full inventory of what exists under `src/components/`. Built on the tokens in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md). Items marked **(added)** were introduced by this audit's gap-fill pass; everything else predates it — check before assuming something needs building, it's probably already here.

## `components/ui/` — primitives (shadcn/Radix, generic, no app logic)

accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, chart, checkbox, collapsible, command, dialog, dropdown-menu, form, hover-card, input, label, navigation-menu, pagination, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, sonner (toast), switch, table, tabs, textarea, tooltip.

These map directly to the request list: Buttons → `button`, Dialogs → `dialog`, Drawers/Sheets → `sheet`, Checkboxes/Radio/Select → `checkbox`/`radio-group`/`select`, Date Picker → `calendar` (+ `react-day-picker`), Breadcrumb → `breadcrumb`, Tabs/Accordion/Table/Pagination → self-explanatory, Quick Search → `command` (drives `GlobalSearch`), Toast → `sonner`, Progress Bars → `progress`, Loading Skeletons → `skeleton`. **Multi Select is the one primitive genuinely missing from this list** — added as `components/shared/multi-select.tsx` (see below); it isn't a shadcn stock primitive so it lives in `shared/`, not `ui/`, since it's a composed component rather than a Radix wrapper.

## `components/shared/` — reusable app-level components

| Component | Purpose |
|---|---|
| `data-table/data-table.tsx` | The one TanStack-Table-backed table every list view uses — sorting, pagination, empty state, row click, built in |
| `data-table/data-table-toolbar.tsx` | Search input + filter slot + actions slot, standard header above every `DataTable` |
| `data-table/data-table-pagination.tsx` | Pagination controls bound to the table instance |
| `empty-state.tsx` | Icon + title + description + optional action — used by `DataTable` automatically and standalone in cards (e.g. `RecentActivityCard`) |
| `error-state.tsx` **(added)** | Same shape as `EmptyState` but for genuine error conditions (failed load, not "no data yet") — was missing; every list view had a "no data" empty state but no distinct error state |
| `status-pill.tsx` | Generic tone-based pill (`neutral`/`info`/`success`/`warning`/`destructive`/`primary`) plus a `DocumentStatusPill` specialization — the pattern to extend for any new status enum |
| `stat-card.tsx` | KPI/metric card: label, value, icon, optional trend arrow, accent color — this is the app's "KPI Card" / "Metric Card" |
| `page-header.tsx` | Title + description + breadcrumb slot + actions slot, top of every module page |
| `form-modal.tsx` | `Dialog`-based form shell (trigger + header + footer wiring) — the "Confirmation Dialog"-adjacent building block for modal forms |
| `form-drawer.tsx` | `Sheet`-based form shell, same idea as `form-modal` but slide-in |
| `confirm-dialog.tsx` **(added)** | Thin `AlertDialog` wrapper for destructive-action confirmation (delete, archive, reject) — the primitive existed but had no reusable "are you sure?" wrapper; every confirmation flow was rebuilding this ad hoc or missing it |
| `timeline.tsx` **(added)** | Extracted the actor-avatar + action + timestamp feed pattern that was duplicated between `RecentActivityCard` and the activity tabs inside `client-detail-tabs`/`matter-detail-tabs` into one reusable list renderer |
| `global-search.tsx` | Cmd+K command palette (`⌘K`), searches across modules the current role has access to |
| `multi-select.tsx` **(added)** | Checkbox-backed multi-value select on top of `Popover` + `Command`, for filters/forms needing more than one value (e.g. multi-practice-area filters) |
| `role-coming-soon.tsx` | Fallback screen for a role/module combination not yet built |
| `charts/` | Reserved for shared chart wrapper components — currently empty; dashboard charts (`revenue-chart.tsx` etc.) build directly on `ui/chart.tsx` (Recharts wrapper) today. Leave empty until a second chart actually needs to share logic — don't pre-build wrappers with no second caller. |

## `components/layout/` — app chrome

- `sidebar.tsx` — collapsible, nested sections from `buildNavSections`, active-state highlighting from the current pathname, mobile off-canvas via `Sheet` below `lg`.
- `topbar.tsx` — global search trigger, role-filtered quick actions, notification popover (mark-as-read), profile dropdown (sign out via `logout` Server Action).
- `theme-toggle.tsx` — light/dark/system switch, wired to `next-themes`.

## `components/dashboard/` — dashboard widgets (14)

`announcements-card`, `document-status-card`, `firm-kpis-row`, `kpi-row`, `matter-pipeline-chart`, `my-matters-card`, `my-recent-documents-card`, `my-time-this-week-card`, `practice-area-chart`, `quick-actions-card`, `recent-activity-card`, `recent-clients-card`, `revenue-chart`, `task-overview-card`, `team-utilization-card`, `todays-schedule-card`, `upcoming-deadlines-card`. Each role's `page.tsx` composes a subset of these based on what's relevant to that role (fee-earner dashboards emphasize "my matters"/"my time"; Managing Partner's emphasizes firm-wide KPIs/revenue).

## `components/<module>/` — per-module presentational components

One folder per module (`clients`, `matters`, `billing`, `documents`, `hearings`, `tasks`, `hr`, `court-cases`, `companies`, `contacts`, `attendance`, `leaves`, `meetings`, `notes`, `notifications`, `audit-logs`, `clauses`, `templates`, `knowledge-base`, `client-portal`, `finance`, `analytics`, `reports`, `document-generator`, `auth`, `settings`). Naming convention: `<module>-table.tsx` (list view), `new-<module>-form.tsx` (create form), `<module>-detail-tabs.tsx` + `<module>-header.tsx` (detail view, for the two modules that have one). Follow this naming exactly for new modules — it's what makes the codebase navigable without a per-module README.

### `components/clients/` (full inventory — the most fleshed-out module folder, reference this for what a mature module looks like)

`clients-table.tsx` (list, takes a `canManage` prop that hides Import/Duplicate-detection links for read-only roles), `archived-clients-table.tsx` (`canRestore` prop, same gating idea), `client-header.tsx` (detail header — Print/Share icon buttons live here, always visible, plus an optional `actions` slot for Edit/Archive/Merge), `client-detail-tabs.tsx` (Overview/Matters/Invoices/Documents/Timeline/Meetings/Notes/Communication/Activity), `new-client-form.tsx` / `edit-client-form.tsx` (share field markup via `client-form-fields.tsx`), `client-actions-menu.tsx` (Archive/Restore + opens `merge-client-dialog.tsx`), `duplicate-detection-view.tsx` (groups from `getDuplicateClientGroups`, pick-a-primary + merge), `relationship-manager-view.tsx` (roster from `getRelationshipManagerRoster`), `import-clients-view.tsx` (CSV paste/upload → `lib/csv.ts` parse → per-row Zod validation preview → `bulkImportClients`), `add-note-form.tsx`.

## Document viewing

`components/documents/document-preview-drawer.tsx` now renders a real inline preview via `components/documents/document-viewer.tsx` **(added)**, built on the already-installed `@react-pdf-viewer/core` + `@react-pdf-viewer/default-layout` packages — previously this was a static placeholder box with no actual preview despite the dependency being installed. Verified end-to-end (upload → preview → real PDF renders with zoom/page nav/thumbnails) against a real PDF file. Notes from that verification:

- `pdfjs-dist`'s canvas module touches browser-only globals (`DOMMatrix`) at module-evaluation time, which crashes SSR. `DocumentViewer` is loaded via `next/dynamic(..., { ssr: false })` from `document-preview-drawer.tsx`, not statically imported — don't change that back to a static import.
- The pdf.js worker is served locally at `GET /api/pdf-worker` (`src/app/api/pdf-worker/route.ts`), which streams the worker script straight from the installed `pdfjs-dist` package rather than pointing at a CDN — keeps the "no cloud dependency" constraint intact and guarantees the worker always matches the installed API version.
- **Known limitation**: `@react-pdf-viewer/core@3.12` declares a peer dependency on `pdfjs-dist ^2.16.105 || ^3.0.279`, but this project has `pdfjs-dist@6.1.200` installed (needed elsewhere/newer than the library targets). Canvas-based page rendering works correctly against v6, but the invisible text-selection overlay does not (`renderTextLayer is not a function` — that function was replaced by a `TextLayer` class in later pdfjs-dist versions). Net effect: PDFs render and are zoomable/paginated/downloadable, but text inside the preview isn't selectable/searchable. Fixing this properly means either downgrading `pdfjs-dist` (would break whatever else in the app pulled in v6) or upgrading to a `@react-pdf-viewer` release built against v6+, if one exists — left as follow-up, see `DEVELOPMENT_PLAN.md`.
- Seed-generated documents (`prisma/seed.ts`) are plain-text files with a `.pdf`/`.docx` extension, not real binary documents — the viewer correctly reports "Invalid PDF structure" for those (verified). It renders real PDFs correctly once actual PDF bytes are uploaded through the real upload flow.
