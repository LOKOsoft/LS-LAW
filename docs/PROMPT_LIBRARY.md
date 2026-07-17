# Prompt Library

Every prompt template in the app is registered once, at import time, in
`src/lib/platform/ai/prompt/templates.ts`. This is the single source of
truth — nothing inlines a prompt string at a call site.

## Registered templates

| id | Capability | Variables | Expected output |
|---|---|---|---|
| `matter.summarize` | Summarize a matter's current state | `matterTitle`*, `clientName`*, `stage`*, `recentActivity` | text |
| `matter.meeting-brief` | Generate a pre-meeting brief | `matterTitle`*, `openItems` | text |
| `document.summarize` | Summarize a document's content | `documentName`*, `content`* | text |
| `document.analyze` | Extract structured metadata from document text | `content`* | json |
| `clause.recommend` | Recommend clauses for a drafting context | `documentType`*, `context`* | list |
| `research.summarize` | Synthesize research findings across articles | `query`*, `articleExcerpts`* | text |
| `risk.narrative` | Turn risk-engine findings into plain language | `findings`* | text |

(`*` = required variable — rendering without it throws `MissingPromptVariableError`.)

## How rendering works

```ts
import { promptRegistry } from "@/lib/platform/ai";

const prompt = promptRegistry.render("matter.summarize", {
  matterTitle: "Acme v. Beta",
  clientName: "Acme Corp",
  stage: "DRAFTING",
  recentActivity: "Filed motion\nScheduled hearing",
});
```

`{{variableName}}` placeholders are substituted; an optional variable left
unfilled becomes an empty string rather than throwing.

## Response validation & parsing

Each template declares an `expectedOutput` shape (`text` | `json` | `list`).
`getResponseParser(shape)` returns the matching parser
(`TextResponseParser` / `JsonResponseParser` / `ListResponseParser`);
`DefaultResponseValidator` checks the raw response actually matches that
shape before it's parsed (non-empty text, valid JSON, a non-empty list).
`JsonResponseParser` tolerates a provider wrapping its JSON in prose or a
fenced code block — common real-LLM behavior.

## Provider mappings

`promptRegistry.mapProvider(promptId, providerName)` /
`promptRegistry.providerFor(promptId)` let a specific prompt be pinned to a
provider it was tuned for (e.g. a template written for Ollama's instruction
format) without scattering `if (provider === "ollama")` checks through call
sites. Not currently used anywhere — `MockAIProvider` answers every prompt
identically regardless of provider, so pinning has no effect yet. Wire it in
once a real provider's prompt format actually diverges from another's.

## Versioning

Every `PromptTemplate` carries a `version` number. Bump it when the
template text changes meaningfully; don't overwrite in place if
reproducibility of past AI interactions ever matters (e.g. for an audit
trail of what prompt produced what output) — that's not implemented today
since nothing logs AI interaction history yet, but the `version` field
exists specifically so that becomes possible without a schema change.

## Adding a new prompt

1. Add a `PromptTemplate` entry to `templates.ts` with a unique `id`,
   variables, template text, and `expectedOutput`.
2. Call it via `AIPipeline` (`docs/AI_ARCHITECTURE.md`), not
   `promptRegistry.render()` + a raw provider call — the pipeline handles
   validation/parsing for you.
3. If the prompt has a real intended use (a UI button, a Server Action),
   wire that up in the relevant `features/<module>/actions.ts` — see
   `features/matter-assistant/actions.ts` for the pattern.
