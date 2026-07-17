/** Semantic search preparation (Step 5) — mock only, no real vector database or embedding model. Builds on `EmbeddingService`/`VectorSearchService` in `../types.ts`. */

export interface SimilarityResult {
  id: string;
  score: number;
}

export interface SimilaritySearchService {
  /** Compares a query embedding against a candidate set and ranks by cosine-similarity-like score. */
  findSimilar(queryEmbedding: number[], candidates: { id: string; embedding: number[] }[], topK?: number): Promise<SimilarityResult[]>;
}

export interface RankedDocument {
  id: string;
  score: number;
  title: string;
  excerpt: string;
}

export interface DocumentRankingService {
  rank(query: string, documents: { id: string; title: string; text: string }[]): Promise<RankedDocument[]>;
}

export type ContextChunk = {
  sourceId: string;
  sourceTitle: string;
  text: string;
};

export interface ContextBuilderService {
  /** Assembles retrieved chunks into a single context block sized to a token budget, for feeding a future RAG-style prompt. */
  buildContext(chunks: ContextChunk[], maxTokens: number): Promise<string>;
}

export type Citation = {
  sourceId: string;
  sourceTitle: string;
  locator?: string;
};

export interface CitationEngineService {
  /** Extracts citation markers a generated answer references back to, given the source chunks it was built from. */
  extractCitations(answerText: string, sourceChunks: ContextChunk[]): Promise<Citation[]>;
}
