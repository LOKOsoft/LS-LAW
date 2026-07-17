# Architecture decisions

Key decisions from the SaaS-readiness pass, in ADR-lite form: what was
decided, why, and what it costs.

## 1. A separate `src/lib/platform/` layer, not extending `lib/services/`

**Decision:** Future-SaaS scaffolding (auth interfaces, tenancy, billing,
storage/notification/AI provider abstractions, config, logging, caching,
errors, security) lives in a new `src/lib/platform/` tree, not inside the
existing `src/lib/services/` (the real workflow/notification/activity/error
business logic) or `src/lib/auth/` (the real session/password code).

**Why:** `FOLDER_STRUCTURE.md` has a standing rule against adding a parallel
mock service layer that duplicates real, working code. Keeping the new
interface-driven scaffolding in its own tree, with its own README stating
"nothing here is a hard dependency," makes the boundary between "real,
working code" and "future-capability scaffolding" a folder, not a
convention someone has to remember.

**Cost:** One more top-level `lib/` folder to know about. Mitigated with
`src/lib/platform/README.md`'s table of what's real vs. mock per capability.

## 2. Wrap real implementations instead of re-implementing them

**Decision:** `lib/platform/storage`'s `LocalStorageAdapter` and
`lib/platform/notifications`'s `InAppChannel` call the existing real
`lib/storage/local-storage.ts` / `lib/services/notifications.ts` functions
directly — they don't reimplement file-writing or notification-row-creation
logic.

**Why:** Two implementations of "write a file locally" or "create a
Notification row" is a bug waiting to happen the day one gets updated and
the other doesn't. Wrapping means the interface exists for future swap-out,
but there is exactly one code path doing the real work today.

**Cost:** None — this is strictly additive indirection with the same
runtime behavior as before.

## 3. Single-tenant model kept as-is; tenancy is descriptive, not enforced

**Decision:** `lib/platform/tenancy` resolves "the current tenant" to the
one `Firm` row that exists (`prisma.firm.findFirst()`), and documents three
future isolation strategies (shared-schema with `firmId`, schema-per-tenant,
db-per-tenant) with a recommendation, rather than adding a `Tenant` model,
`firmId` foreign keys, or any query scoping now.

**Why:** Every model in `prisma/schema.prisma` implicitly belongs to the one
firm today; adding real tenant scoping now would mean touching every
`features/*/queries.ts` call site's `where` clause for zero behavioral
benefit (there's still only one firm) and real risk (a forgotten filter on
one query would be a cross-tenant data leak the day multi-tenancy actually
ships). Recommended approach when it's real: shared-schema with `firmId`,
since query functions already accept a `{ scopeUserId }` scoping parameter —
adding `{ scopeFirmId }` alongside it is a small, familiar extension of an
existing pattern, not a new one.

**Cost:** None today. The real cost lands later, when someone has to add
`firmId` scoping to every query — documented here so that's a planned
migration, not a surprise.

## 4. Money stays `Float`; tags stay comma-joined strings

**Decision:** Not changed in this pass (inherited from earlier passes,
reconfirmed here as still the right call for now).

**Why:** `Float` money and comma-joined tags are fine at single-firm, local
scale. Migrating to `Decimal`/integer-minor-units or a normalized `Tag`
model now, with no real multi-currency or tag-filtering requirement driving
it, would be speculative schema churn. Both are flagged in
`docs/DATABASE_ARCHITECTURE.md` and `docs/DEVELOPMENT_PLAN.md`'s follow-up
list as things to revisit when a real requirement (real currency handling
at scale, tag-based filtering/analytics) shows up.

## 5. CSP without nonces

**Decision:** `next.config.ts`'s CSP header uses `'unsafe-inline'` rather
than per-request nonces.

**Why:** Nonce-based CSP requires every page to render dynamically (Next's
own CSP guide is explicit: static generation and ISR are incompatible with
it). This app has no current reason to give up static optimization, and
doing so would be a real, unrequested behavior change bundled into a
"prepare for the future" pass. Tightening to nonces is real follow-up work
if/when this ships as a public-facing product with stricter compliance
needs — see `docs/SECURITY.md`.

## 6. Rate limiting and caching are in-memory, not Redis, today

**Decision:** `lib/platform/security/rate-limiter.ts` and
`lib/platform/cache/memory-cache-provider.ts` are process-local. Redis
adapters exist only as placeholders that throw `ProviderNotConfiguredError`.

**Why:** A real Redis dependency would violate "zero external services
locally." The interfaces (`CacheProvider`, and the rate limiter's shape)
are written so a Redis-backed implementation is a drop-in replacement, not
a redesign, whenever this runs as more than one process.

## 7. Bundled test infrastructure uses Vitest + Playwright, not Jest

**Decision:** Vitest for unit/integration, `@playwright/test` for
e2e/accessibility/performance/visual.

**Why:** `playwright-core` was already a devDependency (used ad hoc for
manual verification in an earlier pass) — `@playwright/test` is the natural
promotion of that into a real, committed test suite. Vitest was chosen over
Jest for unit/integration because it shares Vite's transform pipeline
(fast, native ESM/TS, no separate Babel config) and integrates cleanly with
this project's existing `tsconfig.json` path aliases.
