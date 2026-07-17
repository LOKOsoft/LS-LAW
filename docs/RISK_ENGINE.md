# Risk Analysis Engine

`src/features/risk/` — a real, rule-based engine over live Prisma data. Not
an AI call: every rule is a pure, deterministic function, independently
unit-tested (`tests/unit/features/risk-rules.test.ts`).

## Architecture

- **`types.ts`** — `RiskFinding` (the output shape) and `RiskRule<T>` (a
  rule: `id`, `title`, `severity`, and a pure `evaluate(context: T)`
  function).
- **`rules.ts`** — eight configured rules, each pure (no Prisma import, no
  side effects) — given plain data, returns findings. This is what makes
  "configurable business rules" real: a rule is just a function you can
  swap, add to `ALL_RISK_RULES`, or unit-test in isolation.
- **`queries.ts`** — `getMatterRisks(matterId)` fetches the data each rule
  needs and runs the full sweep; `getFirmWideRisks()` runs it across every
  active matter.

## The eight rules

| Rule id | Severity | What it checks |
|---|---|---|
| `missing-signature` | HIGH | `DocumentFile` status FILED/FINAL with no `signedAt`. |
| `missing-approval` | MEDIUM | `DocumentFile` at CLIENT_APPROVAL with no `approvedAt`. |
| `expired-contract` | HIGH | `GeneratedDocument.expiresAt` in the past (see docs/DOCUMENT_GENERATION.md — populated for Lease Agreements and Powers of Attorney). |
| `upcoming-limitation` | HIGH/MEDIUM | `CourtCase.limitationDate` within 60 days or already passed (new nullable field added this phase). |
| `pending-invoice` | MEDIUM | Invoice SENT/PARTIALLY_PAID/OVERDUE, past due date, balance outstanding. |
| `missing-mandatory-documents` | MEDIUM | Matter open >14 days with zero documents filed. |
| `overdue-hearing` | HIGH | Hearing still SCHEDULED after its date has passed. |
| `overdue-compliance-task` | LOW | Task not DONE, past its due date. |

## "Overdue compliance activities" — an honest scoping note

This app has no dedicated Compliance model. `overdue-compliance-task`
flags overdue `Task` records generally — compliance checklist items (e.g.
"Run conflict of interest check") are seeded as ordinary Tasks via
`lib/services/task-templates.ts`, not a separate compliance entity. A
dedicated Compliance model with its own status/category would be the real
enhancement path if this becomes a standalone feature; documented here
rather than silently narrowing the rule's real behavior.

## UI

`components/matters/matter-risks-panel.tsx` — a "Risks" tab on the matter
detail page, computing six of the eight rules directly from data the page
already loaded (no extra fetch). The other two rules
(`expired-contract`, `upcoming-limitation`) need `GeneratedDocument`/
`CourtCase` data this particular page doesn't currently include in its
query — they're fully implemented and tested, just not wired into this one
view. `getMatterRisks()`/`getFirmWideRisks()` in `features/risk/queries.ts`
run the complete eight-rule sweep and are ready for a future dedicated risk
view (e.g. a firm-wide risk dashboard) to call.

## Adding a new rule

1. Define input types + a pure `RiskRule<T>` in `rules.ts` (see existing
   rules for the pattern).
2. Add it to `ALL_RISK_RULES`.
3. If it needs data not already fetched, add the query in
   `queries.ts`'s `getMatterRisks()`.
4. Write a unit test — rules are pure, so no database/mocking needed (see
   `tests/unit/features/risk-rules.test.ts`).
