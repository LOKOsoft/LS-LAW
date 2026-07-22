# Enterprise Maturity Assessment

Where LEXORA sits on a Startup → SMB → Mid-market → Enterprise → Global
Enterprise maturity curve, and concretely what moves it to the next stage.
Assessed against this pass's evidence (`docs/ENTERPRISE_REVIEW.md` and its
seven supporting reviews), not aspirational positioning.

## Maturity stages, defined for this assessment

- **Startup**: works, but core flows are fragile or manual; no real data
  model discipline; security is an afterthought.
- **SMB**: real data model, real workflows, runs reliably for one
  organization; security covers the basics; some manual operational
  overhead is acceptable.
- **Mid-market**: hardened for one org at moderate scale; RBAC and audit
  trails are real and enforced, not just modeled; automated testing/CI
  exists; performance holds under real data volume.
- **Enterprise**: multi-tenant or cleanly isolable per customer;
  centralized, auditable authorization on every mutation; compliance-ready
  audit logging; horizontal scalability; formal SLAs achievable.
- **Global Enterprise**: the above plus multi-region deployment, data
  residency controls, i18n/l10n, 24/7 operational tooling, third-party
  security certification (SOC 2 / ISO 27001), enterprise SSO (SAML/OIDC).

## Where LEXORA is today: **solidly SMB, with specific Mid-market blockers**

**Evidence for SMB, comfortably met:**
- Real, normalized data model (39 models, 3NF, now properly indexed —
  `docs/DATABASE_REVIEW.md`).
- Real business workflows with server-enforced guards in the two most
  audited pipelines (matter-stage transitions, document approval —
  `docs/ENTERPRISE_REVIEW.md`'s business-logic findings).
- Password hashing, session security, CSP, and injection/XSS surfaces are
  all genuinely solid (`docs/SECURITY_REVIEW.md` §4–6).
- Consistent architecture across 35 feature modules with zero real
  circular dependencies (`docs/ARCHITECTURE_REVIEW.md`).
- A real, working (if narrow) AI provider architecture with no cloud
  lock-in (`docs/AI_REVIEW.md`).

**What was blocking Mid-market — two of four fixed in this same pass**
(each maps to a `docs/TECHNICAL_DEBT.md` item):
1. ~~RBAC is not centrally enforced~~ — **fixed**: `requireUser()` now
   gates the six previously-unprotected action files, so every mutation
   at minimum requires a valid session, independent of which UI called
   it. Role-specific restrictions (not just "any session") remain as debt
   #20, a smaller follow-up.
2. **No CI pipeline** — tests exist and pass but nothing runs them
   automatically (Testing score 74/95, `docs/QUALITY_SCORECARD.md`).
   Mid-market requires regressions to be caught before merge, not by
   developer discipline alone. Not addressed this pass — genuinely needs
   a CI provider decision, not a code change.
3. ~~Navigation breaks below 1024px~~ — **fixed**: a shared off-canvas
   mobile nav now backs every role layout, verified via a live browser
   smoke test.
4. **Billing lifecycle gaps** — no time-entry editing, no invoice-void
   path, unchecked overpayments (debt #4, #6, #7). A Mid-market law firm's
   billing/trust-accounting expectations are stricter than what the app
   currently supports. Not addressed this pass — these are new features
   (a `TimeEntry` CRUD surface, a void-invoice workflow), correctly out of
   scope for a review-and-standardize pass per the phase's explicit
   instruction not to build new features.

## What's needed to reach Mid-market (concrete, in priority order)

1. ~~Wire `requireUser()` into every Server Action performing a write~~ —
   done this pass. Remaining: assign role-specific `withPermission()`
   checks per action (debt #20) so authorization isn't just
   "authenticated" but "the right role."
2. Stand up CI (GitHub Actions or equivalent) running `tsc`, `eslint`, and
   the full test suite on every PR — the tooling to run already exists,
   documented in `docs/DEPLOYMENT_GUIDE.md`; this is enabling it, not
   building it.
3. ~~Fix mobile navigation~~ — done this pass.
4. Close the billing lifecycle gaps (debt #4, #6, #7) — required for any
   firm relying on the app as its actual billing system of record, not
   just a task/matter tracker.
5. Extend accessibility test coverage beyond the current 6 flows.

None of these require new architecture — every one applies existing,
already-designed patterns more completely. This is the single most
important conclusion of this maturity assessment: **LEXORA's ceiling is
higher than its current wiring reflects.**

## What's needed to reach Enterprise (beyond Mid-market)

- **Real multi-tenancy**: shared-schema `firmId` scoping across every
  query (`docs/ARCHITECTURE_DECISIONS.md` §3 already specifies the
  recommended approach) — this is the largest single piece of work on
  this list, correctly scoped in `docs/FUTURE_INTEGRATIONS.md` as "treat
  it as its own project."
- **Postgres migration** — SQLite's single-writer model is the real,
  documented ceiling on horizontal scale (Scalability 55/95, a deliberate
  score, not an oversight).
- **Real object storage** (S3/Azure Blob/GCS) replacing local filesystem
  storage, and Redis replacing in-memory cache/rate-limiting — both have
  a documented, low-friction swap path already (`docs/FUTURE_INTEGRATIONS.md`).
- **Compliance-grade audit logging** — `ActivityLog` exists and is
  written to at real call sites today, but would need formalized
  retention/immutability guarantees and coverage audited across every
  mutation path, not just the ones checked this pass.
- **Formal security review / penetration test** before any Enterprise
  customer commitment — this review is a rigorous internal audit, not a
  substitute for one.

## What's needed to reach Global Enterprise (beyond Enterprise)

Multi-region deployment and data residency, i18n/l10n (the app is
currently English-only with no translation infrastructure), 24/7
operational tooling (on-call, alerting, SLAs), and third-party
certification (SOC 2 Type II / ISO 27001) — none of which are meaningfully
started today, and none of which should be, absent an actual Global
Enterprise customer driving the requirement. Building any of this
speculatively would repeat the exact mistake this review's methodology was
built to avoid: adding architecture for a requirement nobody has yet.

## Summary

| Stage | Status |
|---|---|
| Startup | ✅ Long since exceeded |
| SMB | ✅ Met, verified this pass |
| Mid-market | 🟡 Blocked by 4 concrete, bounded gaps — all wiring, not design |
| Enterprise | 🔴 Requires real multi-tenancy + Postgres + object storage — a planned, scoped, not-yet-started project |
| Global Enterprise | 🔴 Not started, not currently justified by any real requirement |

See `docs/FINAL_RECOMMENDATIONS.md` for how this maturity assessment
sequences against the Technical Debt register's priorities.
