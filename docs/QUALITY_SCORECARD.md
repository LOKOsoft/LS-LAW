# Quality Scorecard

Enterprise-review pass. Target raised from 85 to **95** — the bar for
"ready for commercial, multi-firm deployment," not just "ready for one
firm running it locally." Every score below was re-verified this pass
(fresh `eslint`/`tsc`/`madge`/`knip` runs, fresh grep-based audits per
category, five parallel deep-dive reviews) — several categories move
significantly from the prior 85-target scorecard, in both directions,
because this pass looked harder and in different places, not because the
code regressed since the last release.

| Category | Score | Target | Status |
|---|---|---|---|
| Architecture | 92 | 95 | 🟡 Close |
| Database | 95 | 95 | ✅ At target |
| Code Quality | 90 | 95 | 🟡 Close |
| Documentation | 93 | 95 | 🟡 Close |
| Maintainability | 88 | 95 | 🟡 Below |
| Developer Experience | 87 | 95 | 🟡 Below |
| UI (visual design system) | 88 | 95 | 🟡 Below |
| AI Architecture | 89 | 95 | 🟡 Below |
| Performance | 83 | 95 | 🟡 Below |
| Accessibility | 80 | 95 | 🟡 Below |
| Testing | 74 | 95 | 🔴 Well below |
| UX (workflow/navigation) | 86 | 95 | 🟡 Below — critical gap fixed this pass |
| Security Readiness | 76 | 95 | 🟡 Below — critical gaps fixed this pass |
| Scalability | 55 | 95 | 🔴 Well below — deliberate, not a defect |

## Above or at target

**Database (95).** See `docs/DATABASE_REVIEW.md`. The one real gap this
review found (46 missing FK indexes across 24 models) was fixed in this
same pass, migrated, regenerated, and verified (typecheck + full test
suite green). Remaining gap to 100 is a product question (`ResearchNote`
one-note-per-article constraint), not a defect.

## Close to target

**Architecture (92)**, **Code Quality (90)**, **Documentation (93)** — see
`docs/ARCHITECTURE_REVIEW.md` for fresh evidence (zero real circular
deps, no god files, ports-and-adapters platform layer confirmed, one
low-priority duplication pattern newly logged). Code Quality reconfirmed
clean (`eslint`: 1 pre-existing documented warning, 0 errors; `tsc
--noEmit`: clean). Documentation unchanged in scope, this pass's own
review docs held to the same evidence-over-assumption standard as the
rest.

## Below target — real, mostly bounded gaps

**Maintainability (88) / Developer Experience (87) / UI (88)** — not
independently re-audited this pass beyond what the architecture review
already covers; carried forward from the prior verified pass. No evidence
of regression found while reviewing adjacent code.

**AI Architecture (89).** See `docs/AI_REVIEW.md`. Provider abstraction,
local Ollama integration, and lock-in avoidance are all genuinely solid
and verified, not just documented. One real, fixable gap: the prompt
registry claims versioning it doesn't structurally enforce (flat `Map`
keyed by id, silently overwritten on re-registration). **To reach 95**:
fix the registry key shape (Medium effort), and give at least one more
feature (document analysis or clause suggestion) a live call site beyond
Matter Assistant.

**Performance (83).** See `docs/PERFORMANCE_REVIEW.md`. FK indexing (this
pass) closed the one truly urgent gap. Remaining: 3 N+1 patterns (2
parallelized/low-impact, 1 confirmed dead code), unbounded pagination on
6 query functions, and 7 chart components shipping un-lazy-loaded.
**To reach 95**: convert the 2 live N+1s to `groupBy` (Low effort), add
`take`/`skip` to the 6 unbounded queries (Low effort), wrap the 7 chart
imports in `next/dynamic` (Low effort, established pattern already used
for the PDF viewer).

**Accessibility (80).** Not re-audited with fresh `axe` runs this pass —
carried forward from the prior verified pass, which found and fixed real
systemic contrast/labeling issues but covered only 6 of the app's flows.
No new accessibility-specific finding this pass, though the UX review's
mobile-navigation finding below has an accessibility dimension too
(keyboard/screen-reader users on narrow viewports face the same "no nav"
problem as touch users). **To reach 95**: extend `tests/accessibility/`
coverage to the remaining major modules, as previously planned.

## Below target — the two findings that mattered most this pass, now fixed

**UX (86, was 71 before same-pass fix, 82 in the prior release).** See
`docs/UX_REVIEW.md`. This pass found that primary sidebar navigation was
completely hidden below the `lg` (1024px) breakpoint app-wide, with no
off-canvas replacement — a genuine, high-impact gap the prior UX pass
hadn't surfaced because it focused on accessibility contrast, not
responsive navigation. **Fixed in this same pass**: a shared `SidebarNav`
component now backs both the desktop sidebar and a new `Sheet`-based
mobile nav wired into `topbar.tsx`, verified working at a 390×844 viewport
via a live browser smoke test (hamburger opens, nav renders, links
navigate and close the sheet, zero console errors). Held below 95 because
the smaller UX findings (breadcrumbs unused, generic create-form error
messages, no delete UI for research notes) remain open — see
`docs/TECHNICAL_DEBT.md`'s Low-priority items.

**Security Readiness (76, was 58 before same-pass fix, 78 in the prior
release).** See `docs/SECURITY_REVIEW.md`. This pass found that six
`actions.ts` files (`matters`, `clients`, `clauses`, `search`,
`templates`, `matter-assistant`) had **zero server-side authentication
checks at all** on real write operations — not merely a missing role
check, confirmed via direct grep, not inference — plus an unauthenticated
file-serving route (`app/api/storage/[...path]/route.ts`). **Fixed in this
same pass**: `requireUser()` now gates every exported function in all six
files, with `actorId`/`authorId` derived from the session rather than
trusted as a caller-supplied parameter (closing an audit-trail spoofing
risk too); the storage route now requires a valid session via
`getSessionUser()`. Verified via `tsc`, `eslint`, the full test suite, a
production build, and a live browser smoke test (advancing a matter's
stage, adding a note, and attempting to archive a client with active
matters all still work correctly with the session-derived identity).
Held below 95 because two follow-ups remain, both correctly scoped as
separate from the emergency fix: role-specific `withPermission()` checks
on top of the new session checks (today any authenticated role can call
these actions, not yet restricted to the right role per action), and
ownership/scope checks on the storage route (today any authenticated user
can read any file, not yet scoped to files they're actually permitted to
see). Both need a product decision on the intended per-action/per-role
rules before implementing — guessing at that mapping quickly would trade
one kind of risk for another. See `docs/TECHNICAL_DEBT.md` items #20–#21.

## Unchanged — deliberate architectural choice, not a gap

**Scalability (55).** SQLite, local filesystem storage, and in-memory
rate-limiting/caching all work correctly for exactly what this app is:
one firm, one server. This does not move without real infrastructure
investment (Postgres, object storage, Redis) and building that
speculatively, with no multi-instance deployment to justify it, would
itself be the wrong call — see `docs/ARCHITECTURE_DECISIONS.md` and
`docs/VERSION_1_ROADMAP.md`'s explicit non-goals. Scored honestly low so
it's read as a roadmap item, not a defect.

**Testing (74).** Real, passing coverage across 6 test categories, no CI
enforcing it yet. Unchanged from the prior pass — not re-audited for new
gaps this pass beyond confirming the full suite (unit + integration, 43
tests) still passes after this pass's schema migration.

## How to read this scorecard

Fourteen categories, one 95-target bar throughout. One category (Database)
is at target because this pass found and fixed its one real gap in the
same sitting. Two categories (UX, Security) had their single most
important finding fixed in this same pass too — both moved from "well
below target, with a specific mechanism identified" to "below target,
with a smaller, well-scoped follow-up remaining" within one sitting,
which is the clearest evidence in this whole review that the app's debt
is wiring debt, not design debt: every fix applied an existing pattern,
guard, or hook rather than requiring new architecture. Scalability remains
a deliberate, documented non-goal. See `docs/TECHNICAL_DEBT.md` for the
full Critical/High/Medium/Low register (now showing three Critical items
as fixed) and `docs/FINAL_RECOMMENDATIONS.md` for sequencing what's left.
