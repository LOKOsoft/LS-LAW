# Security Checklist

Status as of this release. ✅ done and verified · ⚠️ partial/placeholder ·
❌ not started (with reason). See `docs/SECURITY.md` for the full narrative.

## Application security

- ✅ Real password hashing (`crypto.scrypt`), DB-backed sessions, httpOnly
  `SameSite=Lax` session cookie.
- ✅ Login rate limiting (10 attempts / 5 min / email), in-memory.
- ✅ Security headers + same-origin CSP (`next.config.ts`) on every route.
- ✅ File upload validation (size limit, blocked executable extensions) —
  `app/api/upload/route.ts`.
- ✅ Storage path sanitization (`resolveStoragePath` asserts the resolved
  path stays inside `STORAGE_ROOT`) — checked again this release for the
  Document Generator's export path; safe (sanitizes at two independent
  layers).
- ✅ Input validation via Zod on every mutating Server Action, including
  all 15 Document Generator document-type schemas.
- ✅ User-facing error messages never leak stack traces/internal details
  (`toUserFacingError()` in `lib/platform/errors`).
- ✅ No `dangerouslySetInnerHTML` with user-controlled content anywhere in
  the app (the one usage, in the shadcn chart primitive, injects
  developer-authored CSS custom properties, not user input).
- ⚠️ CSRF: not a dedicated token scheme — relies on Next.js Server
  Actions' built-in Origin-header validation (covers all mutations) plus
  `SameSite=Lax` cookies (covers the two real `app/api/*` routes). See
  `docs/SECURITY.md` for why an additional token scheme would be
  redundant today.
- ⚠️ Encryption: `lib/platform/security/encryption.ts` is a passthrough
  placeholder — nothing is encrypted at rest beyond password hashing.
  Needed before storing any real third-party credential (a future
  payment provider key, etc.).

## Multi-tenancy / auth readiness (not implemented, by design)

- ❌ Real authentication provider (SSO/OAuth) — interfaces exist
  (`lib/platform/auth`), not connected.
- ❌ RBAC beyond the existing nav-level + F/C/V/— matrix — see
  `docs/API_PREPARATION.md`'s RBAC section for the readiness assessment.
- ❌ Tenant data isolation — single `Firm` row; see
  `docs/ARCHITECTURE_DECISIONS.md`.

## Dependency / supply chain

- ✅ No unused dependencies flagged this release beyond `react-icons`
  (removed) and `@testing-library/dom` (was missing, now installed —
  previously a broken peer dependency, not a vulnerability, but worth
  noting it means component tests couldn't have run before this pass).
- ❌ No automated dependency vulnerability scanning (`npm audit` in CI,
  Dependabot/Renovate) configured yet — no CI pipeline exists at all (see
  `docs/DEPLOYMENT_GUIDE.md`).

## Accessibility as a security-adjacent concern

- ✅ Every icon-only interactive control has an accessible name (fixed
  this release — see `docs/UI_GUIDELINES.md`); this matters for security
  too, since a mislabeled destructive action (e.g. an unlabeled delete
  button) is both an accessibility and a use-error risk.
- ✅ The one previously-unconfirmed destructive action (court list
  deletion) now requires confirmation.

## Recommended before a real multi-user/hosted deployment

1. Real auth provider + RBAC enforcement at the Server Action layer
   (today's authorization is nav-visibility + the F/C/V/— matrix, which
   individual actions are expected to respect but nothing enforces
   centrally — see `lib/platform/auth/guards.ts`'s `withPermission()`,
   built but not wired into any action yet).
2. Encrypt any real secret (payment provider keys, etc.) before storing —
   replace `NoopEncryptionService`.
3. Move rate limiting and caching to Redis before running more than one
   instance.
4. Add dependency vulnerability scanning to CI once CI exists.
5. Add a CSRF token scheme only if a real deployment target requires
   defense-in-depth beyond Origin validation + SameSite cookies (e.g. a
   compliance requirement) — not needed for the current architecture.
