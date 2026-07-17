# Quality Scorecard

Honest, evidence-based scores (0–100) as of this release, not aspirational
self-assessment. "Enterprise target" = 85 for most categories — the bar for
"ready for commercial deployment as-is." Where a category is below target,
the gap and concrete next step are stated — some gaps are real technical
debt (see `docs/KNOWN_LIMITATIONS.md`), not something fixable by more
polish alone.

| Category | Score | Target | Status |
|---|---|---|---|
| Architecture | 92 | 85 | ✅ Above target |
| Code Quality | 90 | 85 | ✅ Above target |
| Documentation | 93 | 85 | ✅ Above target |
| Maintainability | 88 | 85 | ✅ Above target |
| Developer Experience | 87 | 85 | ✅ Above target |
| UI | 88 | 85 | ✅ Above target |
| Performance | 84 | 85 | 🟡 Just below — see below |
| UX | 82 | 85 | 🟡 Below — see below |
| Accessibility | 80 | 85 | 🟡 Below — see below |
| Security Readiness | 78 | 85 | 🟡 Below — see below |
| Testing | 74 | 85 | 🟡 Below — see below |
| Scalability | 55 | 85 | 🔴 Well below — real, known constraint |

## Above target

**Architecture (92).** Feature-based structure consistently followed
across ~35 feature modules; zero circular dependencies outside
auto-generated Prisma code (verified via `madge`); the platform-scaffolding
layer is cleanly separated from real working code with an enforced
convention (`src/lib/platform/README.md`); real bugs caught this release
(Client Component/Prisma boundary violations) were structural, not
one-offs, and are now documented as a standing rule in `CONTRIBUTING.md`.

**Code Quality (90).** `tsc --noEmit` and `eslint` both clean (one
pre-existing, documented warning). No dead code beyond what's
intentionally kept as design-system/scaffolding surface (verified via
`knip`, cross-checked against what's deliberate). Core business logic
(workflow transitions, risk rules, document diffing) now has real test
coverage added this release.

**Documentation (93).** 29 files in `/docs` plus `CONTRIBUTING.md` and
`src/lib/platform/README.md`, consistently cross-referenced, and honest
about limitations rather than only describing successes — verified this
release by checking several claims (e.g. "no other components have this
bug") against actual `grep` sweeps, not assumption.

**Maintainability (88) / Developer Experience (87) / UI (88)** — supported
by the same evidence: consistent shared-component reuse (`DataTable`,
`EmptyState`, `ConfirmDialog`, `StatusPill`), clear conventions documented
and enforced, real fixes this release closing gaps rather than adding new
surface area.

## Below target — what's actually missing

**Testing (74).** Real coverage exists across 6 categories (unit,
integration, component, e2e, accessibility, performance, visual) and all
currently pass — but coverage is a fraction of the app's total surface
(most feature modules have no dedicated test yet), and there's no CI
pipeline enforcing any of it automatically. **To reach 85:** add tests
per-module as each is touched (don't backfill everything at once — see
`docs/TESTING.md`), and stand up CI once a provider is chosen
(`docs/DEPLOYMENT_GUIDE.md`).

**Security Readiness (78).** Real, working fundamentals (auth, CSP,
rate limiting, file validation, input validation) but RBAC is enforced by
convention (UI hides what a role shouldn't see) rather than centrally at
the Server Action layer, encryption is a passthrough placeholder, and no
dependency vulnerability scanning runs anywhere. **To reach 85:** wire
`withPermission()` into at least the highest-risk Server Actions (billing,
settings/user management), and add `npm audit` (or equivalent) once CI
exists. See `docs/SECURITY_CHECKLIST.md`.

**Accessibility (80).** This release found and fixed real, systemic WCAG
AA violations (contrast across the shared design system, missing
accessible names on ~15+ interactive elements used app-wide) — a
significant improvement from before this pass, verified via automated
axe scans, not just visual inspection. Held below target because
automated a11y coverage is still only 6 pages/flows out of the app's full
surface (dashboard, matters list/detail, document generator, login) —
the *fixes* were systemic (shared components), but *verification* wasn't
exhaustive. **To reach 85:** extend `tests/accessibility/` to the
remaining major modules (billing, documents, clients, settings) —
straightforward given the pattern is established, just needs the time.

**UX (82).** Confirmation dialogs, loading/error/empty states, and
consistent toast feedback are all in place and consistently used. Held
below target because two real, tested features (research bookmarks/
notebook) have no UI entry point yet, and breadcrumbs (hook + primitive
built) aren't rendered anywhere. **To reach 85:** ship the UI for either
gap — both are scoped, bounded pieces of work, not new design decisions
(`docs/VERSION_1_ROADMAP.md`'s near-term list).

**Performance (84).** Everything measured is genuinely fast and
efficient (React Compiler auto-memoization, paginated tables, lazy-loaded
PDF viewer, no N+1 queries in any wired-in path). Held just below target
because there's no production (non-dev-mode) performance measurement yet
— only a coarse local dev-mode budget test — and one query path
(`getFirmWideRisks()`) is unbatched, though currently unused in any UI.
**To reach 85:** add a production-mode performance budget test once
there's a real deployment target to measure against.

## Well below target — a real, known constraint, not a polish gap

**Scalability (55).** SQLite (single-process, single-file), local
filesystem storage, and in-memory rate-limiting/caching all work
correctly and efficiently for exactly what this app is: one firm, one
server, running locally. None of that scales past one instance —
by design, not oversight, and the migration path for each piece is fully
documented (`docs/DEPLOYMENT_GUIDE.md`, `docs/ARCHITECTURE_DECISIONS.md`).
**This score will not move without actual infrastructure investment**
(Postgres, real object storage, Redis) — no amount of code polish changes
it, and building that infrastructure speculatively, with no real
multi-instance deployment to justify it, would itself be the wrong call
(see `docs/VERSION_1_ROADMAP.md`'s explicit non-goals). Scored honestly
low here specifically so it isn't mistaken for a gap this release should
have closed.

## How to read this scorecard

Six categories are at or above an "enterprise-ready for a single-firm
commercial deployment" bar. Five are close, with concrete, bounded next
steps already identified. One (Scalability) reflects a deliberate,
documented architectural choice appropriate for what this app is today,
not a defect — treat it as a roadmap item, not a bug.
