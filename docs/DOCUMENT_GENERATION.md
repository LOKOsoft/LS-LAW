# Document Generation

`src/features/document-generator/` — a real, deterministic document
drafting engine, not an LLM call. Given structured form input, it assembles
real legal document text via string templates. This is what "AI Document
Generator" means for a structured-input flow: the intelligence is in the
field schema and document structure, not a language model. No prompt is
sent anywhere for this feature.

## Why deterministic, not LLM-based

Generating a legal document from a fixed set of structured fields (parties,
dates, amounts, terms) is a mail-merge problem, not a natural-language
understanding problem. A deterministic engine is more reliable (same input
→ same output, every time), needs no AI provider at all, and is what most
production legal-document-assembly tools actually do under the hood. The
`AIProvider` layer is reserved for genuinely open-ended text (matter
summaries, meeting briefs — see `docs/AI_ARCHITECTURE.md`), not for this.

## Supported document types (15)

Legal Notice, NDA, Employment Agreement, Service Agreement, Vendor
Agreement, Shareholder Agreement, Power of Attorney, Affidavit, Will, Lease
Agreement, Partnership Deed, Privacy Policy, Terms & Conditions, General
Contract, Corporate Resolution — see `GeneratedDocumentType` in
`prisma/schema.prisma` and `DOCUMENT_TYPE_CATALOG` in
`features/document-generator/types.ts`.

## Architecture

- **`schemas.ts`** — a Zod schema per document type (`DOCUMENT_SCHEMAS`),
  plus `DOCUMENT_FIELD_META` (labels + input kind: text/textarea/number/
  date/email) driving a single generic dynamic form — there's one form
  component (`components/document-generator/generate-document-dialog.tsx`),
  not 15 bespoke ones.
- **`generator.ts`** — `generateDocumentContent(type, fields)`: validates
  fields against the type's Zod schema, then renders real document text via
  a per-type template function. `suggestDocumentTitle()` derives a sensible
  title from the fields; `extractExpiryDate()` pulls an expiry date where
  the type has one (lease end date, power-of-attorney expiry) — this feeds
  the Risk Analysis Engine's expired-contract rule.
- **`compare.ts`** — the real Document Comparison Engine (Step 9); see its
  own section below.
- **`queries.ts` / `actions.ts`** — the real Prisma-backed data/workflow
  layer, following this codebase's standard `features/<module>/` convention.

## Data model

`GeneratedDocument` (current state + metadata) and
`GeneratedDocumentVersion` (full history, mirroring the existing
`DocumentFile`/`DocumentVersion` pattern) — see `prisma/schema.prisma`.
`GeneratedDocumentStatus` is its own enum
(`DRAFT → IN_REVIEW → REVISION_REQUESTED → APPROVED → EXPORTED`), separate
from `DocumentStatus` (the real Documents module's file-approval pipeline)
since a not-yet-signed AI draft has a different lifecycle than a filed
document.

## Workflow

1. **Draft** — `createGeneratedDocument()` generates content from form data, creates version 1.
2. **Revision** — `reviseGeneratedDocument()` regenerates content from edited form data, bumps the version, resets status to `DRAFT`.
3. **Review** — `submitGeneratedDocumentForReview()` → `IN_REVIEW`.
4. **Revision requested** — `requestGeneratedDocumentRevision()` sends it back with a note.
5. **Approval** — `approveGeneratedDocument()` → `APPROVED`.
6. **Export** — `exportGeneratedDocument()`: writes the approved text to real storage via `getStorageProvider()` (the platform storage abstraction — see `docs/FUTURE_INTEGRATIONS.md`) and creates a real `DocumentFile` row, closing the loop into the existing Documents module. Only an `APPROVED` document can be exported.

Every transition is guarded by a `BusinessRuleError` check (wrong starting
status throws) and logged via `logActivity()` — matching this codebase's
existing workflow conventions in `lib/services/workflow.ts`.

## Document Comparison Engine (Step 9)

`compareDocumentVersions(oldText, newText)` in `compare.ts` — a real LCS
(longest-common-subsequence) line diff, refined in two passes:

1. An adjacent removed→added pair with ≥40% word overlap becomes
   **modified** rather than a separate add + remove.
2. An exact-text removed/added pair that ISN'T adjacent (so pass 1 didn't
   catch it) becomes **moved**.

Returns a `ComparisonReport`: per-line `DiffOp[]` (unchanged/added/removed/
modified/moved) plus counts and a change-percentage summary. Wired into the
UI at `components/document-generator/generated-document-detail-sheet.tsx`
("Compare to current" per version).

**Scoping note:** this only operates on `GeneratedDocument` text, which
this app actually has as plain text. Comparing two versions of an arbitrary
*uploaded* document (a Word/PDF file) would need OCR/text-extraction first
— that's `lib/platform/ai/document-analysis`'s mock
`VersionComparisonService`, deliberately kept separate and mock-only. See
docs/DOCUMENT_ANALYSIS.md.

## What's not built (follow-up work)

- Clause-library injection into generated text (e.g. auto-inserting a
  matching confidentiality clause from the Clause Library into an NDA) —
  the generator is currently self-contained; wiring in `features/clauses`
  would be a real enhancement.
- PDF export (currently exports plain text) — would need a PDF-generation
  dependency; out of scope for this pass to avoid unnecessary new deps.
