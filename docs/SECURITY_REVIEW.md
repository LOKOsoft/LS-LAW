# Security Review

Defensive security posture review — our own app's readiness, no auth
implementation performed. Every claim below was re-verified against the
actual code this pass (grep sweeps, direct reads), sharpening and in one
case substantially correcting the prior pass's `docs/SECURITY_CHECKLIST.md`
characterization of RBAC as merely "UI convention."

## 1. RBAC / authorization enforcement — the top finding, corrected from prior framing

**Prior framing was too soft.** `docs/QUALITY_SCORECARD.md`'s previous
pass described the gap as "RBAC enforced by UI convention rather than
centrally at the Server Action layer" — implying every action at least
checks *that someone is logged in*, just not *which role*. That is not
what the code does.

**Confirmed this pass**: `grep -c "requireUser"` across six `actions.ts`
files returns **zero** in every one — `features/matters/actions.ts`,
`features/clients/actions.ts`, `features/clauses/actions.ts`,
`features/search/actions.ts`, `features/templates/actions.ts`,
`features/matter-assistant/actions.ts`. These Server Actions perform real
writes (`createClient`, `updateClient`, `archiveClient`, `restoreClient`,
`mergeClients`, `reassignRelationshipManager`, and the equivalent matter
mutations) with **no server-side authentication check at all** — not just
no role check. Authorization is entirely delegated to "the caller reached
the right UI page."

Worse: in `clients/actions.ts`, `actorId`/`managerId` used for audit-log
attribution are plain parameters supplied by the *caller*, not derived
from the session server-side (e.g. `updateClient(clientId, input,
actorId)`). If one of these actions is ever invoked directly (a Server
Action's encrypted reference, once known, can be POSTed to independent of
which page rendered it), the audit trail itself can be spoofed — a
different actorId than whoever actually acted.

**Where enforcement does exist, it's inconsistent even within one file**:
`features/settings/actions.ts`'s `toggleUserStatus` correctly calls
`requireUser(Role.MANAGING_PARTNER)`, but `deleteCourtListEntry` in the
same file calls bare `requireUser()` — any authenticated role can delete
court configuration. `features/billing/actions.ts`'s
`generateInvoiceFromUnbilledTime`, `createInvoice`, and `recordPayment`
all call bare `requireUser()` too — any authenticated user, regardless of
role, can generate invoices or record payments.

**The real fix exists and is unwired**: `lib/platform/auth/guards.ts`'s
`withPermission()`/`assertPermission()` implement exactly the centralized
permission-matrix check this needs, with a doc comment explicitly stating
they're "not wired into any existing route or Server Action." Confirmed
via grep: zero call sites outside that file. This is the single highest-
priority item in `docs/TECHNICAL_DEBT.md` — wiring `withPermission()` into
at minimum `clients`, `matters`, `billing`, and `settings` actions closes
the largest real gap in the app.

**Supporting gap — `proxy.ts`'s protected-route list is incomplete.**
`src/proxy.ts`'s `PROTECTED_PREFIXES` covers `managing-partner`,
`senior-partner`, `associate`, `paralegal`, `reception`, `accounts`, `hr`,
`client` — but omits `partner`, `junior-associate`, `legal-researcher`,
and `administrator` entirely. This is a secondary control (each page still
calls `requireUser()` itself server-side), but the omission means those
four role trees get no cookie-presence pre-check at the edge, inconsistent
with the other nine.

## 2. Input validation coverage

`grep` for `.parse(`/`.safeParse(` across all 16 `actions.ts` files: 7 use
Zod validation (`clients`, `billing`, `settings` partially, `documents`,
`document-generator`, `hearings`, and others), roughly 44% of files.
`matters`, `clauses`, `search`, `templates`, and `matter-assistant` have no
runtime schema validation at all — arguments are trusted at their
TypeScript type with no runtime enforcement, meaning a malformed or
malicious payload reaching these (again, easier given finding #1's lack of
even an auth gate) is not rejected before touching the database.

## 3. File upload/serving

`app/api/upload/route.ts` correctly requires a session and validates file
size/extension before writing. **`app/api/storage/[...path]/route.ts` has
no authentication check at all** — any request that knows or guesses a
storage path can download any file, including another matter's or
client's documents. Path-traversal is correctly mitigated (`path.join` +
`startsWith(STORAGE_ROOT)`) and Content-Type/Content-Disposition come from
a fixed extension map rather than trusting the client — both good — but
the missing authorization check on the read path is a real, direct
information-disclosure risk, independent of finding #1.

## 4. Session & password security — solid, confirmed working

Session cookie is `httpOnly`, `sameSite: "lax"`, `secure` in production,
7-day expiry, with real DB-backed expiry checking on every lookup.
Passwords use `scryptSync` + `timingSafeEqual` (not plaintext, not a weak
hash) — confirmed in `lib/auth/password.ts`. `prisma/seed.ts` seeds demo
users through the same real hashing function, not a shortcut. No findings
here; this part of the app is genuinely production-grade already.

## 5. Injection surface

Zero `$queryRaw`/`$executeRaw` usage anywhere in `src/` — all database
access goes through Prisma's parameterized query builder. No SQL injection
surface exists in this app today.

## 6. XSS surface

Exactly one `dangerouslySetInnerHTML` in the entire codebase
(`components/ui/chart.tsx`), and it injects a CSS custom-property string
built from developer-configured chart color keys, never user-supplied
content. No real XSS surface found.

## 7. Audit logging

Real, working call sites exist in `billing/actions.ts`,
`clients/actions.ts`, and the upload route — this is not schema-only
scaffolding, confirmed by direct reads of multiple call sites. The caveat
from finding #1 stands: logging exists, but it's not a substitute for the
missing authorization checks, and the actor attribution it records can be
spoofed at the same call sites that lack a session-derived identity.

## Fix applied this pass

Findings #1 and #3 above were fixed in this same pass (the user directed
"do what is recommended" after the findings were reported). `requireUser()`
now gates every exported function in `matters`, `clients`, `clauses`,
`search`, `templates`, and `matter-assistant` actions, with `actorId`/
`authorId` derived from the session instead of trusted as a parameter.
`app/api/storage/[...path]/route.ts` now requires a valid session via
`getSessionUser()`, matching the pattern already used by the upload route.
Both verified via `tsc --noEmit`, `eslint`, the full unit + integration
suite (43 tests), a production build, and a live browser smoke test
(matter stage advance, note creation, and a blocked client-archive attempt
all still functioned correctly with the session-derived identity).

**What's still open, deliberately not done in the same pass:**
role-specific `withPermission()` checks per action (today any
authenticated role can call these actions — the fix requires *a* session,
not *the right* role) and ownership/scope checks on the storage route
(today any authenticated user can read any file, not yet scoped to files
they're permitted to see). Both need a product decision on the intended
per-action/per-role and per-document access rules — see
`docs/TECHNICAL_DEBT.md` items #20–#21.

## Score

**76/100** — up from 58 (this review's initial finding) after fixing the
two most severe gaps in the same pass, though still below the prior
release's 78 because that score's "enforced by convention" framing turned
out to understate the original problem, and the two remaining follow-ups
(role-specific checks, ownership scoping) are real, not yet closed.
Everything else audited (sessions, passwords, injection, XSS, CSP, rate
limiting) remains genuinely solid, unchanged from before. See
`docs/TECHNICAL_DEBT.md`'s Critical section (now marked fixed) and items
#20–#21 for what's left, and `docs/FINAL_RECOMMENDATIONS.md` for the
prioritized remediation path.
