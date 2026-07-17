# Document Analysis Engine

`src/lib/platform/ai/document-analysis/` — every interface here is
implemented by a local, offline heuristic (pattern-matching/regex), not a
trained model. All fully mock/placeholder, per this project's architecture
rule — no OCR service, no cloud vision API, nothing leaves the process.

## Interfaces & their mock implementations

| Interface | Mock implementation | Heuristic used |
|---|---|---|
| `OCRService` (in `ai/types.ts`) | `MockAIProvider.extractText()` | Returns a canned placeholder string — no real OCR occurs. |
| `DocumentClassificationService` | `MockDocumentClassificationService` | Keyword-scoring against a small table of document-type keyword sets (e.g. "confidential", "non-disclosure" → NDA). |
| `MetadataExtractionService` | `MockMetadataExtractionService` | First non-empty line as a title guess, word count, hardcoded `"en"` language. |
| `NamedEntityExtractionService` | `MockNamedEntityExtractionService` | Regex for capitalized multi-word phrases; classifies as ORGANIZATION if it matches a company-suffix pattern (Ltd/LLP/Inc/...), else PERSON. |
| `DateDetectionService` | `MockDateDetectionService` | Regex for common date formats (`DD/MM/YYYY`, `DD Mon YYYY`). |
| `AmountDetectionService` | `MockAmountDetectionService` | Regex for currency-symbol-prefixed numbers (₹/$/€/£). |
| `PartyDetectionService` | `MockPartyDetectionService` | Regex for "between X and Y" contract-party phrasing. |
| `SignatureDetectionService` | `MockSignatureDetectionService` | Keyword count of "signature"/"signed"/"witness". |
| `VersionComparisonService` | `MockVersionComparisonService` | Word-count-delta percentage — a coarse "how much changed" estimate, not a real diff. |

## Why these are real code, not stubs

Unlike a placeholder that just throws, each mock here does genuine
(if simple) text analysis — a document containing "Ltd" really does get
classified as mentioning an organization; a document with "₹50,000" really
does get that amount extracted. These are legitimate lightweight heuristics
that work reasonably well for structured/formal legal text, not fake data.
They're "mock" only in the sense of not being ML-based — see each class's
own code comment for the exact heuristic.

## Relationship to the real Document Comparison Engine

`MockVersionComparisonService` is the generic, OCR-dependent case: any two
pieces of text, wherever they came from. The Document Generator's
**real** comparison engine (`features/document-generator/compare.ts`,
`compareDocumentVersions()`) does actual LCS-based line diffing with
added/removed/modified/moved classification — but only for
`GeneratedDocument` content, which this app has as real stored plain text.
Comparing two versions of an arbitrary *uploaded* file (a Word doc, a
scanned PDF) would need real OCR/text-extraction first, which is exactly
what stays mock here. See docs/DOCUMENT_GENERATION.md.

## Upgrade path

Replacing any of these with a real implementation (Tesseract for OCR, a
real NER model, a real classifier) is a drop-in swap — each interface's
mock class is a single, isolated file; nothing else in the codebase depends
on the mock behavior specifically, only the interface shape.
