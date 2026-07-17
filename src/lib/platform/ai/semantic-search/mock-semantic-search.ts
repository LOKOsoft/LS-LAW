import type {
  Citation,
  CitationEngineService,
  ContextBuilderService,
  ContextChunk,
  DocumentRankingService,
  RankedDocument,
  SimilarityResult,
  SimilaritySearchService,
} from "@/lib/platform/ai/semantic-search/types";

function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Real cosine-similarity math (deterministic, no mocking needed there) over whatever embeddings were produced — mock only in the sense that the embeddings themselves come from `MockAIProvider.embed()`, not a real model. */
export class MockSimilaritySearchService implements SimilaritySearchService {
  async findSimilar(
    queryEmbedding: number[],
    candidates: { id: string; embedding: number[] }[],
    topK = 5,
  ): Promise<SimilarityResult[]> {
    return candidates
      .map((c) => ({ id: c.id, score: cosineSimilarity(queryEmbedding, c.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

/** Ranks by simple keyword-overlap scoring — a real semantic ranker would replace this with embedding-based similarity; this keeps the interface usable offline today. */
export class MockDocumentRankingService implements DocumentRankingService {
  async rank(query: string, documents: { id: string; title: string; text: string }[]): Promise<RankedDocument[]> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return documents
      .map((doc) => {
        const haystack = `${doc.title} ${doc.text}`.toLowerCase();
        const score = queryTerms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0) / (queryTerms.length || 1);
        return { id: doc.id, score, title: doc.title, excerpt: doc.text.slice(0, 200) };
      })
      .sort((a, b) => b.score - a.score);
  }
}

export class MockContextBuilderService implements ContextBuilderService {
  async buildContext(chunks: ContextChunk[], maxTokens: number): Promise<string> {
    // ~4 characters per token, a common rough estimate — good enough for a budget, not exact.
    const maxChars = maxTokens * 4;
    let result = "";
    for (const chunk of chunks) {
      const piece = `[${chunk.sourceTitle}]\n${chunk.text}\n\n`;
      if (result.length + piece.length > maxChars) break;
      result += piece;
    }
    return result.trim();
  }
}

export class MockCitationEngineService implements CitationEngineService {
  async extractCitations(_answerText: string, sourceChunks: ContextChunk[]): Promise<Citation[]> {
    return sourceChunks.map((chunk) => ({ sourceId: chunk.sourceId, sourceTitle: chunk.sourceTitle }));
  }
}
