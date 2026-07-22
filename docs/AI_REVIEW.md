# AI Architecture Review

Evidence-based re-verification of the AI-first layer built in a prior
phase (`src/lib/platform/ai/`, 9-capability `AIProvider` interface, prompt
registry, local Ollama integration). Every claim below was checked against
the actual code this pass, including live call-site greps — not assumed
from `docs/AI_ARCHITECTURE.md`.

## Provider abstraction — genuinely interface-driven, confirmed

`AIProvider` (`lib/platform/ai/types.ts:78-89`) composes 9 sub-interfaces
(prompt, embedding, vector search, OCR, speech, document analysis,
summarization, clause recommendation, matter summary). `getAIProvider()`
(`lib/platform/ai/index.ts:78-80`) is the sole entry point, selected via
`appConfig.providers.ai` / `LEXORA_AI_PROVIDER`. Checked both real call
sites in the app for lock-in leakage — `features/matter-assistant/actions.ts`
calls only `provider.summarizeMatter(...)` and constructs `AIPipeline`
generically; `features/document-generator/compare.ts` references AI types
in a comment only and never calls `getAIProvider()` at all (comparison is
pure deterministic LCS diff). No provider-specific detail leaks past the
interface at either site.

## Prompt registry/versioning — real gap found

`PromptTemplate.version: number` exists and every template sets `version:
1`, with a doc comment promising "old versions are kept, never deleted."
That promise is **not enforced by the data structure**: `PromptRegistry`
(`prompt/registry.ts:18-54`) is a flat `Map` keyed by `id` alone —
registering a second template under the same `id` silently overwrites the
first. There is no `id@version` composite key and no multi-version store.
**This is a real, fixable gap**, not a design tradeoff: a registry that
claims versioning should key by `(id, version)` and expose a "latest for
this id" lookup on top, or the version field and its doc comment should be
removed to stop overpromising. Logged in `docs/TECHNICAL_DEBT.md` as
Medium priority — the fix is small (change the Map key, add one lookup
method) and prevents a real future bug (a prompt update silently breaking
whatever depended on the old version's exact wording).

## Local model readiness — Ollama integration is real, not a stub

`LocalOllamaProvider` makes real `fetch` calls to
`http://127.0.0.1:11434/api/generate` and `/api/embeddings` with a 5s
timeout (`AbortController`), correctly implementing only `complete`/
`summarize`/`embed` and throwing `ProviderNotConfiguredError` for
capabilities Ollama doesn't cover. `LmStudioProviderPlaceholder`,
`LlamaCppProviderPlaceholder`, and `CloudProviderPlaceholder` are honestly
inert (every method throws) — correctly named and documented as
placeholders, not misleadingly presented as working. Real fallback-chain
logic exists (`FallbackAIProvider.tryEach`, `fallback.ts:26-42`): tries
providers in order, catches, logs, falls through — genuinely functional,
used via `buildProviderChain()` (e.g. `ollama` → `[LocalOllamaProvider,
MockAIProvider]`). `model-manager.ts` tracks active model per provider
with real registered models (`llama3`, `mistral`), not just documentation.

## Knowledge indexing / semantic search — partially real

No embedding/vector/semantic code exists anywhere outside
`lib/platform/ai/` (confirmed via repo-wide grep — zero hits). Within that
module: `MockAIProvider.embed()` is a deterministic char-code pseudo-
vector (not semantic, expected for a mock), but
`semantic-search/mock-semantic-search.ts` contains a **genuine, correct**
cosine-similarity implementation plus a real keyword-overlap ranker —
real math operating on fake embeddings, which is exactly the right
scaffolding shape: swap in a real embedding provider later and the
similarity/ranking logic doesn't need to change.

## Live wiring — one real caller, correctly scoped

`grep` for `lib/platform/ai` imports from `features/`/`components/`
(excluding the platform tree itself) returns exactly two files:
`features/matter-assistant/actions.ts` (a real, live caller —
`generateMatterSummary`/`generateMeetingBrief`) and
`features/document-generator/compare.ts` (a comment reference only, no
runtime call). This confirms the AI layer is not 100% unused scaffolding —
it has one genuine live feature — while document generation and risk
analysis correctly remain deterministic engines with no LLM dependency
(consistent with `docs/AI_ARCHITECTURE.md`'s own table).

## Lock-in risk — low, well-contained

No hardcoded model name leaks outside `model-manager.ts`'s registry and
one fallback default inside `LocalOllamaProvider` (used only if no active
model is set). Ollama's raw response shape (`result.response`/
`result.embedding`) is unwrapped and normalized to `PromptResponse`/
`number[]` inside the adapter before returning — nothing downstream ever
sees an Ollama-specific field name. Swapping to OpenAI/Anthropic/Gemini
is, concretely, "write one new class implementing `AIProvider`," per
`docs/FUTURE_INTEGRATIONS.md`'s existing walkthrough — verified accurate.

## Score

**89/100.** Provider architecture, local-model integration, and lock-in
avoidance are all genuinely solid and verified working, not just
documented as such. Held below the 95 target by the one real registry gap
above (Medium priority fix) and the fact that only one feature (Matter
Assistant) actually calls the AI layer today — everything else that could
plausibly use it (document analysis surfacing in the Documents module,
clause suggestions in the Clause Library) has the provider-side capability
already defined in `types.ts` but no UI/call site yet, which is a scoped,
bounded backlog item (`docs/VERSION_1_ROADMAP.md`), not an architecture
defect.
