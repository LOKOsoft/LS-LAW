# Version 1.0 → Beyond: Roadmap

Where LEXORA stands at v1.0 and what a real next increment looks like, in
priority order. This consolidates the module-specific roadmaps already in
`docs/AI_ROADMAP.md` and `docs/FUTURE_INTEGRATIONS.md` into one place —
see those for full detail on the AI and platform-provider tracks
respectively.

## v1.0 (this release): what's done

A complete, working local practice-management platform for one firm, plus
every future-capability interface a hosted/commercial version would need
— none of them connected to a real external service. See
`docs/RELEASE_NOTES.md` for the full feature list.

## Near-term (next real increment, if there is one)

Roughly in order of "smallest change, most value":

1. **Wire the Research Assistant's bookmark/notebook backend into the
   UI.** Fully built and tested; just needs UI wiring (see
   `docs/KNOWN_LIMITATIONS.md`).
2. **Wire `useBreadcrumbs` into page headers.** Hook and primitive exist;
   not rendered anywhere yet.
3. **A firm-wide risk dashboard**, using `getFirmWideRisks()` (built,
   unused) — batch its queries first (see `docs/PERFORMANCE_REPORT.md`).
4. **Clause-library injection into document generation** — connect two
   already-real features (`features/clauses` and
   `features/document-generator`).
5. **A real local LLM path documented for end users** — `LocalOllamaProvider`
   already works; this is an operational/documentation task, not
   development.

## Medium-term (real infrastructure investment)

6. **Multi-tenancy** — shared-schema + `firmId`, per
   `docs/ARCHITECTURE_DECISIONS.md`'s recommendation. The largest single
   piece of work on this list; treat as its own project with its own
   migration plan, not a side task.
7. **Move off SQLite to Postgres** — only once multi-instance/multi-tenant
   is a real requirement, not before.
8. **Real cloud storage adapter** (S3 or equivalent) — needed once
   multi-instance deployment is real (local disk storage doesn't survive
   a redeploy across instances).
9. **A real payment provider integration** (Stripe/Razorpay) behind the
   existing `PaymentProvider` interface — only relevant once this
   actually ships as a paid product.
10. **Real external notification channels** (email first) — behind the
    existing `NotificationChannel` interface.

## Long-term / speculative (do not build until there's a real driver)

- Public API + webhooks (`docs/API_PREPARATION.md`) — no external
  consumer exists yet.
- Real semantic search / embeddings / vector store — no retrieval feature
  exists yet that would need it.
- Real OCR — nothing in the app currently needs extracted text from
  uploaded files.
- A dedicated Compliance model (beyond the current Task-based proxy in
  the Risk Analysis Engine) — only if compliance tracking becomes a
  distinct, first-class feature request.
- CI/CD pipeline — genuinely overdue in absolute terms, but deliberately
  not built speculatively without a chosen CI provider; should move up
  this list the moment more than one person is contributing.

## Explicit non-goals for the foreseeable future

- Rebuilding the SQLite/local-first architecture "just in case" scale
  becomes a problem — it hasn't, and the migration path is documented
  for when it does (`docs/DEPLOYMENT_GUIDE.md`).
- Connecting a real cloud AI provider without a specific feature that
  needs genuine language understanding beyond what `MockAIProvider`'s
  deterministic responses already demonstrate in the UI.
- Building out `lib/platform/`'s remaining placeholder providers (LM
  Studio, llama.cpp, cloud AI, cloud storage, etc.) ahead of an actual
  decision to use one of them — they exist so that decision is cheap
  later, not to be pre-emptively filled in.
