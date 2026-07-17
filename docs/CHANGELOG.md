# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates reflect when each pass was completed in this repository's history.

## [Unreleased] — Production readiness pass (2026-07-17)

### Added
- Global `src/app/error.tsx`, `not-found.tsx`, `loading.tsx`.
- `CONTRIBUTING.md`.
- 12 release-readiness docs in `/docs` (this file among them).
- Component tests (`@testing-library/react`), workflow/business-rule tests
  for the matter-stage and document-approval pipelines, an additional
  integration test for the Risk Analysis Engine, and 5 new accessibility
  tests covering the dashboard, matters list/detail, and document
  generator (previously: login only).

### Fixed
- WCAG AA color contrast failures in `StatusPill`'s tone colors, the
  settings permission matrix, `stat-card.tsx`'s trend badges, the shared
  `Tabs` primitive's inactive-label color, and the sidebar's section
  labels — root-caused to the shared `--muted-foreground` token being
  too light once any opacity modifier was applied on top of it; darkened
  (light mode) / lightened (dark mode) the token itself.
- Two instances of a firm-configurable color (`PracticeArea.color`)
  being used as inline *text* color, which can't be contrast-checked at
  render time — changed to a decorative color dot/border tint instead.
- Missing accessible names on: the notification bell button, the 4
  data-table pagination buttons (used on every paginated table in the
  app), the document-comment send button, the court-list delete button,
  and roughly a dozen table filter `<Select>` triggers whose only visible
  text was a *placeholder* (not an accessible name per WCAG/ARIA — a
  systemic gap affecting nearly every table's filter toolbar).
- A disconnected mobile "Quick Actions" button in the topbar that did
  nothing when tapped — consolidated into one responsive trigger.
- A missing confirmation dialog on the one destructive action in the app
  that fired immediately without one (court list entry deletion).
- Two real dev-mode runtime bugs (not caught by `next build`, only by
  exercising the app): a Client Component importing a real function from
  a module that also imports Prisma at module scope, in both the
  Document Generator and Knowledge Base modules — see
  `docs/TROUBLESHOOTING.md`.
- Unguarded `JSON.parse` in the (currently unused) browser cache
  scaffolding.

### Removed
- `react-icons` (zero imports anywhere — `lucide-react` is what's
  actually used).
- One genuinely dead exported constant (`navSections` in `lib/constants/nav.ts`).

### Changed
- `--muted-foreground` design token (both light and dark mode) — see
  "Fixed" above.

## [Unreleased] — AI-first platform (prior pass)

### Added
- AI Document Generator (15 document types), real Document Comparison
  Engine, real Risk Analysis Engine (8 rules), Smart Timeline (refactored
  from inline logic), Clause Library / Knowledge Engine enhancements,
  Legal Research Assistant backend (bookmarks/notebook), Matter Assistant.
- Full AI provider architecture (`src/lib/platform/ai`): `AIProvider`
  interface, prompt registry + pipeline + response parsing, model manager,
  fallback strategy, `LocalOllamaProvider` (real, local-only), inert
  placeholders for LM Studio/llama.cpp/cloud providers.
- New Prisma models: `GeneratedDocument`, `GeneratedDocumentVersion`,
  `ResearchBookmark`, `ResearchNote`; new fields on `Clause`,
  `KnowledgeArticle`, `CourtCase`.

## [Unreleased] — SaaS-readiness platform (prior pass)

### Added
- `src/lib/platform/`: auth/permission interfaces, tenancy scaffolding,
  billing/subscription interfaces, storage provider abstraction (wraps
  the real local filesystem code), notification channel abstraction
  (wraps the real in-app notifications), centralized config, structured
  logging, in-memory caching, typed error hierarchy.
- Security headers + CSP (`next.config.ts`), upload file validation,
  login rate limiting.
- Full testing infrastructure (Vitest + Playwright): unit, integration,
  e2e, accessibility, performance, visual regression.
- 7 architecture/readiness docs.

## v1.0 — Ship V1.0 (original)

### Added
- Real authentication (scrypt + DB-backed sessions).
- All 12 staff personas + Client Portal, every module in the PRD as a
  real Prisma-backed feature (not a placeholder/tab).
- Role-scoped queries, live Settings (users + permission matrix + court
  list), Audit Logs, Attendance/Leaves with approval workflow, Analytics.
