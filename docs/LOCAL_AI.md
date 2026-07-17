# Local Model Preparation

How LEXORA is prepared to run against a real on-device LLM instead of
`MockAIProvider`, without any cloud dependency and without changing
business logic when a provider is swapped.

## Ollama (real, if installed)

`src/lib/platform/ai/providers/local-ollama-provider.ts`'s
`LocalOllamaProvider` is a genuinely working implementation — it makes real
HTTP calls to `http://127.0.0.1:11434` (Ollama's default local port), never
the public internet. If Ollama is installed and running with a pulled
model:

```bash
LEXORA_AI_PROVIDER=ollama
```

wires it in. `complete()` calls `/api/generate`; `embed()` calls
`/api/embeddings`; `summarize()`/`summarizeMatter()` are built on top of
`complete()`. Every other `AIProvider` method (OCR, speech, document
analysis, clause recommendation) intentionally throws
`ProviderNotConfiguredError` — Ollama has no equivalent endpoints, so
pretending otherwise would be dishonest. Those calls fall through to
`MockAIProvider` via the fallback chain (see docs/AI_ARCHITECTURE.md).

**If Ollama isn't running:** every request times out after 5 seconds and
falls back to mock automatically — selecting `ollama` without Ollama
actually installed degrades gracefully, it doesn't break the app.

**Which model:** `lib/platform/ai/model-manager.ts` registers `llama3` and
`mistral` as known Ollama models; `LocalOllamaProvider` asks the model
manager which one is "active" rather than hardcoding a model name. Pull
whichever model you want to use (`ollama pull llama3`) — the app doesn't
manage model downloads itself.

## LM Studio & llama.cpp (placeholders)

`lib/platform/ai/providers/local-runtime-placeholders.ts`:
`LmStudioProviderPlaceholder` and `LlamaCppProviderPlaceholder` — both
inert (every method throws `ProviderNotConfiguredError`). Both real
runtimes expose an OpenAI-compatible local HTTP API (LM Studio typically at
`localhost:1234`, llama.cpp's server mode typically at `localhost:8080`),
so a real implementation would follow `LocalOllamaProvider`'s exact
pattern — a localhost-only `fetch` with a short timeout — just against a
different endpoint shape. Not implemented in this pass; see
docs/FUTURE_INTEGRATIONS.md for the concrete steps to add one.

## Switching providers without touching business logic

Every feature that uses AI (`features/matter-assistant/actions.ts`, the
mock recommendation/analysis paths) calls `getAIProvider()` from
`lib/platform/ai`, never a concrete provider class. Verified: no
`new MockAIProvider()` / `new LocalOllamaProvider()` / etc. appears anywhere
outside `lib/platform/ai/` itself (checked as part of this phase's Step 14
quality review). Switching `LEXORA_AI_PROVIDER` is the entire integration
surface.

## What's NOT here

No model download/management UI, no GPU/quantization configuration, no
model-switching UI in the app itself (`modelManager.setActive()` exists as
an API but nothing calls it from a settings page yet). These would be real
follow-up work once a specific local-model deployment story is decided.
