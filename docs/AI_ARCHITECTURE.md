# AI Architecture

The AI-first layer of LEXORA lives in two places, split by what's real and
what's mock:

- **`src/lib/platform/ai/`** — the provider abstraction itself: interfaces,
  the prompt engine, the pipeline, model management, fallback, and every
  provider implementation (mock, local, cloud-placeholder).
- **`src/features/*`** (`document-generator`, `risk`, `timeline`,
  `matter-assistant`, `clauses`, `knowledge-base`, `research`) — real
  features that either don't need AI at all (deterministic engines) or
  consume the provider abstraction for the narrow slice that genuinely needs
  narrative text generation.

No cloud AI provider (OpenAI, Anthropic, Gemini, Azure OpenAI, AWS AI,
Google AI) is connected anywhere in this codebase. The app is 100%
functional offline.

## Provider interface (`ai/types.ts`)

`AIProvider` is the umbrella interface every provider implements:
`PromptService`, `EmbeddingService`, `VectorSearchService`, `OCRService`,
`SpeechService`, `DocumentAnalysisService`, `SummarizationService`,
`ClauseRecommendationService`, `MatterSummaryService`. A caller depending on
`AIProvider` doesn't know or care which concrete provider answers it.

## Providers

| Provider | File | Real or mock? |
|---|---|---|
| `MockAIProvider` | `ai/mock-ai-provider.ts` | Fully mock — deterministic, offline, no network calls. Default. |
| `LocalOllamaProvider` | `ai/providers/local-ollama-provider.ts` | **Genuinely real**, but local-only: talks to `127.0.0.1:11434` (a locally-running Ollama instance) for `complete`/`summarize`/`embed`. Every other method throws — Ollama has no OCR/speech/analysis endpoints. Times out and falls back after 5s if Ollama isn't running. |
| `LmStudioProviderPlaceholder`, `LlamaCppProviderPlaceholder` | `ai/providers/local-runtime-placeholders.ts` | Inert placeholders — both expose OpenAI-compatible local HTTP APIs, so a real implementation would look like `LocalOllamaProvider` with a different endpoint shape. Not implemented. |
| `CloudProviderPlaceholder` | `ai/providers/cloud-provider-placeholder.ts` | Inert — represents "some cloud LLM provider." Always throws. Never called for real, per this project's architecture rule. |

## Fallback strategy (`ai/fallback.ts`)

`FallbackAIProvider` composes an ordered list of providers and tries each in
turn per method call, catching failures and moving to the next. The chain
always ends with `MockAIProvider`, which can't fail — so `getAIProvider()`
(the one function anything should call) never throws, regardless of what
`LEXORA_AI_PROVIDER` is set to.

```
getAIProvider() → FallbackAIProvider([selected provider, MockAIProvider])
```

## Model manager (`ai/model-manager.ts`)

Tracks which model id is "active" per provider (e.g. `llama3` vs `mistral`
for Ollama), independent of which provider class is wired up. A provider
asks `modelManager.getActive()` for the model id to request instead of
hardcoding one.

## Prompt engine (`ai/prompt/`)

- `registry.ts` — `PromptRegistry`: register/get/render templates by id,
  with required-variable validation (`MissingPromptVariableError`) and a
  provider-mapping table.
- `templates.ts` — every real prompt template the app uses, registered at
  import time (see `docs/PROMPT_LIBRARY.md`).
- `response-parser.ts` — `TextResponseParser` / `JsonResponseParser` /
  `ListResponseParser` plus `DefaultResponseValidator`, keyed by a
  template's declared `expectedOutput` shape.

## Pipeline (`ai/pipeline.ts`)

`AIPipeline` is the one class that ties it together: render a registered
prompt → send through a provider → validate → parse. Fully
dependency-injected — constructor takes `(provider, registry?, validator?)`,
so a test can substitute fakes for all three without touching the pipeline
itself.

```ts
const pipeline = new AIPipeline(getAIProvider());
const { parsed } = await pipeline.run<string>("matter.meeting-brief", { matterTitle, openItems });
```

## Feature flags

`appConfig.features.aiAssistant` (from `src/lib/platform/config`) is `true`
whenever `LEXORA_AI_PROVIDER` is set to anything other than `mock` — it's a
signal, not a gate; nothing currently branches on it since every provider
path degrades safely through the fallback chain regardless.

## Semantic search & document analysis: separate, more granular layers

`ai/semantic-search/` and `ai/document-analysis/` are **not** duplicates of
`AIProvider`'s `search`/`analyze` methods — they're a more granular,
composable breakdown of the same capability area, per the explicit request
for both a unified provider interface (Step 1) and separate specialized
interfaces (Steps 5–6). `AIProvider` is the one-call umbrella; the
semantic-search/document-analysis services are what a real implementation
of `search()`/`analyze()` would likely be composed from internally. See
docs/SEMANTIC_SEARCH.md and docs/DOCUMENT_ANALYSIS.md.

## What's real vs. mock, end to end

See `src/lib/platform/README.md`'s table for the platform layer generally;
for the AI-specific pieces built in this phase:

| Capability | Real | Mock |
|---|---|---|
| Document generation (14 legal doc types) | ✅ deterministic template engine, no LLM needed | — |
| Document comparison (added/removed/modified/moved) | ✅ real LCS diff algorithm | — |
| Risk analysis (8 rules) | ✅ real rule engine over live data | — |
| Smart timeline | ✅ real data aggregation | — |
| Matter summarization / meeting briefs | data real; narrative text | ✅ `MockAIProvider` |
| Semantic search, embeddings, vector search | — | ✅ mock throughout |
| OCR, NER, classification, signature/date/amount detection | — | ✅ heuristic mocks |
| Legal case search | — | ✅ empty-result mock |
| Local LLM (Ollama) | ✅ real if Ollama is running locally | falls back to mock otherwise |
