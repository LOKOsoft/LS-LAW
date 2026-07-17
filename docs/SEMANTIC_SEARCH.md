# Semantic Search Preparation

Interface scaffolding only — every implementation here is mock. No vector
database, no embedding model, no external service. See
`src/lib/platform/ai/semantic-search/`.

## Interfaces

| Interface | Mock implementation | What it does |
|---|---|---|
| `EmbeddingService` (in `ai/types.ts`) | `MockAIProvider.embed()` | Deterministic pseudo-embedding derived from character codes — not a real semantic embedding, but a stable, fixed-length vector for the same input. |
| `SimilaritySearchService` | `MockSimilaritySearchService` | **Real cosine-similarity math** over whatever embeddings it's given — the mock is in where the embeddings come from (above), not the similarity computation itself, which is genuinely correct linear algebra. |
| `DocumentRankingService` | `MockDocumentRankingService` | Keyword-overlap scoring, not semantic ranking. Ranks by fraction of query terms found in each document. |
| `ContextBuilderService` | `MockContextBuilderService` | Assembles retrieved chunks into one context block within a token budget (~4 chars/token estimate) — the RAG "context assembly" step, ready for a real retrieval pipeline to feed it real chunks. |
| `CitationEngineService` | `MockCitationEngineService` | Returns every source chunk as a citation — a real implementation would parse an LLM's answer text for which sources it actually referenced. |
| `VectorSearchService` (in `ai/types.ts`) | `MockAIProvider.search()` | Returns canned "match" results labeled `[mock match N]` — never claims to have found anything real. |

## Why mock, not "fake it till you make it"

A real semantic search stack needs an embedding model (local or hosted) and
a vector index (FAISS, pgvector, a hosted vector DB — explicitly excluded:
no Pinecone, no Supabase Vector, per this project's architecture rule).
None of that exists here. Rather than half-implement a keyword search and
call it "semantic," each mock is honest about what it actually does (see
each class's own comment) so nobody mistakes keyword overlap for real
retrieval quality.

## How this relates to `AIProvider`

`AIProvider.embed()`/`.search()` are the coarse, one-call versions;
`semantic-search/`'s services are the finer-grained pieces a real RAG
pipeline would compose (embed → similarity search → rank → build context →
cite). Both exist because the request asked for both a unified provider
(Step 1) and separate semantic-search interfaces (Step 5) — see
docs/AI_ARCHITECTURE.md.

## What would need to change for this to become real

1. A real embedding model — either local (`LocalOllamaProvider.embed()`
   already calls Ollama's real `/api/embeddings` endpoint if a real
   embedding-capable model is pulled) or a cloud provider (excluded by
   architecture rule for now).
2. A real vector store — none is wired in; `SimilaritySearchService`'s
   cosine-similarity math would work unchanged against real embeddings, it
   just needs a real candidate set instead of a hand-passed array.
3. Real chunking/retrieval logic feeding `ContextBuilderService` — currently
   nothing produces `ContextChunk[]` from real documents; that's the
   biggest actual gap, not the interfaces themselves.
