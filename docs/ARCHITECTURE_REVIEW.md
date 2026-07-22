# Architecture Review

Enterprise-review pass. Evidence-based, not aspirational — every claim below
was checked against the actual tree (`madge`, `knip`, `wc -l`, and direct
reads), not assumed from `docs/ARCHITECTURE_DECISIONS.md`'s prior write-ups.
Where this doc's findings differ from an earlier pass, this one wins — it
was re-verified today.

## Folder hierarchy

```
src/
  app/(roles)/<role>/<module>/page.tsx   258 route files, 13 role trees + client portal
  features/<module>/{queries,actions,schema,columns}.ts   35 modules
  components/<module>/*.tsx                               ~30 module dirs + ui/ + shared/
  lib/{auth,db,services,storage,platform,constants}
```

One pattern, followed consistently: Server Components read via
`features/*/queries.ts` (imports Prisma, server-only), Server Actions write
via `features/*/actions.ts` (Zod-validated), presentation lives in
`components/<module>/*`. Confirmed the file set per module is *not*
rigid-identical, but each variation is explainable rather than arbitrary:
`schema.ts` exists only where a form needs Zod validation, `columns.tsx`
only where a `DataTable` is used, `actions.ts` only where the module has
mutations (`activity`, `analytics`, `calendar`, `firm`, `hr` are genuinely
read-only today). No orphaned or inconsistent file naming found.

**Finding — thin page-wrapper duplication (by design, bounded by Next.js
routing, not sloppiness).** Read `partner/matters/[matterId]/page.tsx` and
its 8 siblings (`administrator`, `associate`, `junior-associate`,
`legal-researcher`, `managing-partner`, `paralegal`, `senior-partner`,
`accounts`): all 21–24 lines, identical shape, varying only in
`requireUser(Role.X)` and an imported `X_BASE` path constant. This is real,
quantifiable duplication (9 files × ~28 modules with per-role detail pages
is a lot of near-identical files) but it's a deliberate tradeoff, not an
oversight: Next's App Router has no first-class "one route, many roles"
primitive short of a catch-all `[role]` segment plus a runtime role check —
which would trade explicit, staticly-analyzable routes (grep any role's
exact page list) for a single dynamic dispatcher. Not recommended to change
without a concrete pain point (e.g. a 14th role) forcing it — see
`docs/TECHNICAL_DEBT.md` for it logged as Low priority, tracked not ignored.

## SOLID / DRY / KISS

**Single Responsibility.** No god files. Largest non-generated,
non-shadcn-primitive files: `matter-detail-tabs.tsx` (297 lines, a tabbed
container — expected to be larger by nature), `document-generator/
generator.ts` (289, the actual generation engine), `dashboard/queries.ts`
(285, one query file aggregating a multi-widget dashboard). Nothing
resembles a 1000+-line dumping ground. `wc -l` across all of `src/`
(excluding generated code): 27,185 lines, largest single file 374 (a shadcn
primitive, `components/ui/chart.tsx`).

**Open/Closed & Dependency Inversion — the platform layer is already
ports-and-adapters.** `src/lib/platform/<capability>/{types.ts, index.ts,
*-provider.ts}` is, concretely, the hexagonal-architecture pattern: a port
(`types.ts` interface), a factory reading config to select an adapter
(`index.ts`), and one or more adapters (local/mock/placeholder). Confirmed
by reading `src/lib/platform/README.md`'s explicit rule table and spot-
checking `storage/index.ts`, `ai/index.ts`. This isn't aspirational
documentation — `getStorageProvider()` and `getAIProvider()` are real
factory functions consumed by call sites through the interface, never the
concrete class.

**DRY — real, checked, not assumed.** Ran `knip` fresh this session.
Findings are the same shape as before: everything flagged unused is either
(a) `lib/platform/*` scaffolding intentionally exposed but with zero live
callers (documented, expected), or (b) shadcn UI primitives kept for
design-system completeness. Two "duplicate export" warnings in
`lib/constants/nav.ts` (`PARTNER_MODULE_KEYS`/`ASSOCIATE_MODULE_KEYS` both
aliasing `SENIOR_PARTNER_MODULE_KEYS`; `ADMINISTRATOR_MODULE_KEYS` aliasing
`ALL_MODULE_KEYS`) are intentional, not accidental duplication — these
roles currently have identical module access and the alias exists so the
day one role's access diverges, it's a one-line change with no ripple
effect. No real, unintentional duplication found.

**KISS.** `src/lib/services/workflow.ts` (the matter-stage and document-
approval rule engine) imports only Prisma-generated *enums* — confirmed
`src/generated/prisma/enums.ts` has zero runtime dependencies (`grep` for
`require(`/`better-sqlite3` in it returns nothing) — which is why it's
safely importable from both a Server Action (`features/matters/actions.ts`)
and a Client Component (`components/matters/matter-stage-control.tsx`) for
instant client-side transition preview without duplicating the rule logic.
This is the exact discipline `CONTRIBUTING.md`'s standing rule about the
Client/Server Prisma boundary bug asks for, applied correctly here.

## Circular dependencies

Ran `madge --circular` fresh. Zero circular dependencies in application
code — the only cycles reported are internal to Prisma's own generated
client (`generated/prisma/internal/prismaNamespace.ts` ↔
`generated/prisma/models.ts` ↔ per-model files), which is Prisma's own
codegen shape, not something this app's architecture controls or should
try to "fix."

## Clean/Hexagonal Architecture readiness — honest assessment

The **platform layer** (auth, storage, notifications, AI, billing,
tenancy, RBAC, API, webhooks, cache, config, logging, security, errors) is
genuinely hexagonal today: ports defined, adapters swappable via config,
zero call sites depend on adapter internals.

The **core application layer** (`features/*`) is *not* hexagonal and
should not be forced to be: `queries.ts` files call Prisma directly (no
repository interface between them), which is the correct, pragmatic choice
for an app with exactly one data store and no plan to swap it. Introducing
a repository abstraction here today would be the textbook premature-
abstraction mistake this review is specifically checking for — three
similar `findMany` calls across matters/clients/documents don't need an
interface layer between them and Prisma; they need what they have now.

**Where hexagonal *would* pay off if pursued:** the business-rule layer
(`lib/services/workflow.ts`, `lib/services/validation.ts`) is already
isolated from Prisma at the type/enum level, which is exactly the piece
that would need to be a "domain core" in a real hexagonal split. If this
app ever needs a second data store or a headless API consumer, this
existing separation is most of the work already done — a good sign for
future flexibility, not a current gap.

## Score

**92/100.** No change from the prior pass's Architecture score — this
review re-verified the same evidence (zero real circular deps, no dead
code beyond intentional scaffolding, no god files, consistent module
pattern) rather than finding new regressions, plus surfaced the page-
wrapper duplication as an explicit, tracked, low-priority item rather than
an unstated gap. See `docs/QUALITY_SCORECARD.md` for how this rolls up
against the 95-point enterprise target, and `docs/TECHNICAL_DEBT.md` for
the page-wrapper duplication's entry.
