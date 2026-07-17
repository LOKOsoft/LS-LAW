# Security

What's real today, what's scaffolded for later, and why. LEXORA runs fully
locally with zero external services — everything here reflects that.

## Authentication

`src/lib/auth/` is real, not a placeholder: `crypto.scrypt` password hashing
(`password.ts`), DB-backed `Session` rows (`session.ts`), an httpOnly
`SameSite=Lax` session cookie, and a DAL guard (`dal.ts`'s `requireUser()`)
called from every role's `layout.tsx` that does the actual auth + role-match
check with a redirect. `src/proxy.ts` (this Next.js version's renamed
`middleware.ts`) only does a cheap cookie-presence check to avoid a wasted
render before the real check runs.

`src/lib/platform/auth/` adds typed interfaces (`AuthProvider`,
`PermissionService`, `UserContext`, `SessionContext`) and a
`LocalAuthProvider` that reads from the real session/DB — it does not
replace `requireUser()` or change how login/redirect behaves. It exists so a
future pluggable auth provider (SSO, a hosted IdP) has a contract to
implement instead of a rewrite. See `src/lib/platform/README.md`.

## Login abuse protection

`features/auth/actions.ts`'s `login()` is now rate-limited: 10 attempts per
5 minutes per email, in-memory (`src/lib/platform/security/rate-limiter.ts`).
Resets on server restart and isn't shared across instances — fine for a
single local process; replace with a Redis-backed limiter before running
more than one instance, or a distributed brute-force attempt just resets its
counter by hitting a different instance. Failed/rate-limited attempts are
logged via `src/lib/platform/logging` under the `security` category.

## CSRF

Next.js Server Actions validate the request's `Origin` header against the
deployment's allowed origins automatically — this covers every mutation in
the app (`features/*/actions.ts`), since none of them are plain REST
endpoints. The two real `app/api/*` routes (`upload`, `storage/[...path]`)
are protected by the session cookie's `SameSite=Lax` attribute, which browsers
don't send on cross-site non-GET requests — a cross-site form/fetch POST to
`/api/upload` won't carry the session cookie. No additional CSRF token
scheme was added; it would be redundant given the above.

## Content Security Policy & secure headers

`next.config.ts`'s `headers()` (wired to
`src/lib/platform/security/headers.ts`) applies to every route:

- `Content-Security-Policy`: `default-src 'self'` plus `'unsafe-inline'` for
  scripts/styles (Tailwind/Radix/next-themes inject inline styles; `'unsafe-eval'`
  is additionally allowed in development only, since React's dev builds use
  it for better error stacks — see Next's CSP guide).
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: origin-when-cross-origin`, `Permissions-Policy` (camera/
  mic/geolocation all denied).

Deliberately **not** nonce-based: a nonce CSP forces every page into dynamic
rendering (Next.js docs are explicit about this), which would be a real
behavior/performance change this pass didn't want to make. Tightening to a
nonce-based policy is real follow-up work if this ever ships as a
public-facing hosted product with stricter compliance requirements.

## File upload validation

`app/api/upload/route.ts` now runs `validateUploadedFile()`
(`src/lib/platform/security/file-validation.ts`) before writing anything to
disk: rejects empty files, files over 50 MB, and a blocklist of executable
extensions (`.exe`, `.bat`, `.sh`, `.dll`, etc.). This is real, active
validation — not a placeholder — and there was none before this pass.

## Storage path safety

`src/lib/storage/local-storage.ts`'s `resolveStoragePath()` already sanitized
path segments and asserted the resolved path stays inside `STORAGE_ROOT`
before this pass; unchanged.

## Encryption

`src/lib/platform/security/encryption.ts`'s `EncryptionService` is a
passthrough placeholder (`NoopEncryptionService`) — nothing encrypts today.
Password hashing (`lib/auth/password.ts`, `scrypt`) is unrelated and already
real. Wire a real implementation here before storing any third-party
credential (payment provider keys, etc.) at rest.

## Permission boundaries

Authorization today is coarse (nav-level `ModuleKey[]` allow-lists per role,
`src/lib/constants/nav.ts`) plus a fine-grained F/C/V/— matrix
(`permission-matrix.ts`) that individual `actions.ts` files and UI are
expected to respect. `src/lib/platform/auth/permission-service.ts`'s
`LocalPermissionService` is a typed, read-only facade over that same matrix
data (`can()`/`accessLevel()`) — not a new source of truth. `guards.ts`'s
`withPermission()` wrapper is available but not applied to any existing
Server Action; wiring it in per action is real follow-up work (see
`src/lib/platform/auth/guards.ts`'s comment for why it wasn't done here).

## What's explicitly out of scope right now

- Multi-tenant data isolation (single `Firm` row today — see
  `docs/ARCHITECTURE_DECISIONS.md`).
- Real payment/PII handling beyond what the firm's own client billing module
  already stores (money as `Float`, per `DATABASE_ARCHITECTURE.md` — revisit
  before handling real currency at scale).
- Dependency/vulnerability scanning automation (no CI pipeline exists yet).
