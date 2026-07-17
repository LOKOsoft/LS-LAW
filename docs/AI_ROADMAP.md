# AI Roadmap

What this phase built, what's real vs. mock, and what a genuinely useful
next increment looks like — for whoever picks this up next.

## What shipped this phase

**Real, working features** (no AI provider involved — deterministic
engines and data aggregation):
- AI Document Generator — 15 legal document types, structured-form-driven,
  full draft → review → revision → approval → export workflow, versioned.
- Document Comparison Engine — real LCS diff with added/removed/modified/
  moved classification.
- Risk Analysis Engine — 8 configurable rule-based checks over live data.
- Smart Timeline — unified chronological event feed (refactored from
  inline logic into a reusable, tested function).
- Clause Library and Knowledge Engine enhancements — jurisdiction/risk
  level/relationships, cross-references, broader search, real usage
  tracking.
- Legal Research Assistant backend — bookmarking, research notebook (no
  UI wired in yet — see docs/KNOWLEDGE_ENGINE.md).

**AI provider architecture** (interfaces + `MockAIProvider` answering
everything today):
- Full `AIProvider` interface, prompt engine + registry + pipeline, model
  manager, fallback strategy.
- `LocalOllamaProvider` — genuinely functional against a local Ollama
  install, degrades to mock if Ollama isn't running.
- Placeholders for LM Studio, llama.cpp, and cloud providers (OpenAI/
  Anthropic/Gemini) — none connected, per architecture rule.
- Matter Assistant — real pending-task/deadline data + mock narrative
  summarization and meeting briefs, wired into a working UI tab.

**Fully mock, by design** (per explicit instruction — no cloud AI, no
vector DB):
- Semantic search (embeddings, similarity, ranking, context building,
  citations).
- Document analysis (OCR, classification, NER, date/amount/party/
  signature detection).
- Legal case search.

## Immediate next steps, if AI capability becomes a real product priority

Roughly in order of "smallest change, most user-visible value":

1. **Wire a real local LLM.** `LocalOllamaProvider` already works — the
   remaining work is entirely operational (document Ollama as a
   recommended local install in the README, maybe auto-detect it's
   running and surface that in a settings page).
2. **Clause-library injection into document generation.** The generator
   is self-contained today; auto-suggesting/inserting matching clauses
   from `features/clauses` into a generated NDA/agreement would connect
   two already-real features.
3. **Wire the Legal Research Assistant's bookmark/notebook backend into
   the UI.** Backend is done and tested; needs the "current user's
   bookmarked ids" prop threaded into `KnowledgeBaseTable` across the
   ~20 pages that render it (see docs/KNOWLEDGE_ENGINE.md's follow-up
   note).
4. **A firm-wide risk dashboard.** `getFirmWideRisks()` already runs the
   full 8-rule sweep across every active matter; it just needs a page.
5. **Real embeddings + a real vector index**, once there's an actual
   retrieval use case (e.g. "find similar past matters/clauses") to build
   toward — building the vector store before there's a concrete feature
   needing it would be premature.
6. **Real OCR**, once documents in the Documents module need their text
   extracted for something (search, analysis) — currently nothing in the
   app needs uploaded-file text content at all.

## What NOT to do prematurely

- Don't add a real cloud AI provider until there's a specific feature
  that needs true language understanding beyond templated text
  (`MockAIProvider`'s canned summaries are adequate placeholders for
  demoing the UI flow).
- Don't build a vector database integration before there's a retrieval
  feature that needs it (see #5 above) — the interfaces exist precisely so
  this can wait.
- Don't add clause versioning (`ClauseVersion` history table) without a
  real requirement for clause edit history — flagged as a deliberate
  non-decision in docs/CLAUSE_ENGINE.md, not an oversight.
- Don't build compliance-specific tracking beyond the current
  Task-based proxy until a real firm workflow needs a dedicated
  Compliance entity (see docs/RISK_ENGINE.md).

## Architecture guarantee

Every AI-provider swap point — local runtime, cloud provider, embeddings,
whatever comes next — goes through `getAIProvider()`
(`lib/platform/ai/index.ts`). No feature code anywhere instantiates a
concrete provider class directly (verified as part of this phase's Step 14
quality review). Adding a real provider is: implement `AIProvider`, add one
`case` to `buildProviderChain()`'s switch, set an env var. No call site
changes.
