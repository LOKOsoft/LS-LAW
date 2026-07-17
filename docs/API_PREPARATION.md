# API Preparation

LEXORA has no public API today — by design (see `docs/ROUTE_MAP.md`:
"Do not add new `app/api/*` routes for CRUD; use a Server Action instead").
This document is the readiness assessment for if/when a public API,
webhooks, or third-party integrations become a real requirement (Step 10
of this release's scope) — nothing here is implemented.

## Current API surface

Two real `app/api/*` routes exist, both for things a Server Action can't
do:

| Route | Purpose |
|---|---|
| `POST /api/upload` | Multipart file upload |
| `GET /api/storage/[...path]` | Serves uploaded files |

Everything else is Server Components (reads) + Server Actions (writes) —
there is no REST or GraphQL API surface to version or expose externally.

## What a public API would need

### 1. A real API layer

Server Actions aren't callable from outside the Next.js app (they're not
stable HTTP endpoints with a public contract). A public API would need a
parallel `app/api/v1/*` route layer — or, more likely, a separate
API-focused framework/gateway in front of the same `features/*/queries.ts`
and `actions.ts` functions, which already are the real service layer and
wouldn't need to change. The query/action functions were written
independent of "how they're called," so this is additive, not a rewrite.

### 2. Authentication for API clients

Session cookies don't work for server-to-server or third-party API
clients. Needs API keys or OAuth2 client-credentials, which is a new
concept — `lib/platform/auth`'s `AuthProvider` interface would need a
second implementation (`ApiKeyAuthProvider` or similar) alongside
`LocalAuthProvider`, selected per-request based on how the caller
authenticated.

### 3. RBAC enforcement at the API boundary

Today's authorization is nav-level visibility (`ModuleKey[]` allow-lists)
plus the F/C/V/— permission matrix, which individual Server Actions are
*expected* to respect but nothing centrally enforces. A public API
**cannot** rely on "the UI wouldn't render the button" as its access
control — every API endpoint would need to call
`lib/platform/auth/guards.ts`'s `withPermission()` (built, not currently
wired into any action) or equivalent before executing.

### 4. Rate limiting per API client

`lib/platform/security/rate-limiter.ts`'s in-memory limiter currently
only guards login. An API needs per-client-key rate limiting, ideally
Redis-backed (see `lib/platform/cache/redis-cache-provider-placeholder.ts`
for the existing inert placeholder this would pair with).

### 5. Webhooks (outbound)

Doesn't exist. Would need:
- A `Webhook` model (endpoint URL, secret, subscribed event types, active
  flag) — genuinely new schema, no existing analog.
- An event-emission point — the natural place is `lib/services/activity.ts`'s
  `logActivity()`, since it's already the central write path for "something
  happened" across the app; a webhook dispatcher could hook in alongside it.
- Delivery with retries/backoff and signature verification (HMAC over the
  payload with the webhook's secret) — a new, real piece of infrastructure,
  not covered by anything in `lib/platform/` today.

### 6. Third-party integrations

`lib/platform/legal-research/`'s named adapter placeholders
(`IndianKanoonAdapterPlaceholder`, `SccOnlineAdapterPlaceholder`) are the
one existing example of "how a third-party integration adapter should be
shaped" in this codebase — same pattern (a class implementing a shared
interface, inert until a real API key/client is wired in) would apply to
any future accounting software, e-filing system, or document e-signature
provider integration.

## What NOT to build yet

Don't build the API gateway, webhook infrastructure, or a second
`ApiKeyAuthProvider` speculatively. All of `features/*/queries.ts` and
`actions.ts` are already written in a way that doesn't block this later —
building the API layer now, with no real external consumer, would be
exactly the kind of premature infrastructure this project has
deliberately avoided elsewhere (see `docs/ARCHITECTURE_DECISIONS.md`).
