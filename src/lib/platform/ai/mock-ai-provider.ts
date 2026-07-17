import type {
  AIProvider,
  ClauseSuggestion,
  DocumentAnalysisResult,
  OCRResult,
  PromptRequest,
  PromptResponse,
  TranscriptionResult,
  VectorMatch,
} from "@/lib/platform/ai/types";

/** Deterministic, offline stand-in for a real LLM/AI provider. Every method returns a canned, clearly-labeled response derived from its input — never a network call — so UI built against `AIProvider` can be developed and demoed without any API key. */
export class MockAIProvider implements AIProvider {
  readonly name = "mock" as const;

  async complete({ prompt }: PromptRequest): Promise<PromptResponse> {
    return { text: `[mock AI response] You asked: "${prompt.slice(0, 200)}"`, model: "mock-ai-v1" };
  }

  async embed(text: string): Promise<number[]> {
    // Deterministic pseudo-embedding: fixed-length vector derived from char codes, not a real semantic embedding.
    const dims = 8;
    const vector = new Array(dims).fill(0);
    for (let i = 0; i < text.length; i++) {
      vector[i % dims] += text.charCodeAt(i);
    }
    const max = Math.max(...vector, 1);
    return vector.map((v) => v / max);
  }

  async search(query: string, topK = 5): Promise<VectorMatch[]> {
    return Array.from({ length: Math.min(topK, 3) }, (_, i) => ({
      id: `mock-doc-${i + 1}`,
      score: 0.9 - i * 0.15,
      text: `[mock match ${i + 1}] Related to "${query.slice(0, 60)}"`,
    }));
  }

  async extractText(_fileBytes: Buffer, mimeType: string): Promise<OCRResult> {
    return { text: `[mock OCR output for ${mimeType} file — no real text extraction performed]`, confidence: 0.5 };
  }

  async transcribe(_audioBytes: Buffer, mimeType: string): Promise<TranscriptionResult> {
    return { text: `[mock transcription of ${mimeType} audio]`, durationSeconds: 0 };
  }

  async analyze(documentText: string): Promise<DocumentAnalysisResult> {
    return {
      documentType: "Unknown (mock analysis)",
      keyEntities: [{ label: "Sample entity", value: documentText.slice(0, 40) || "(empty document)" }],
      risks: [],
    };
  }

  async summarize(text: string, maxSentences = 3): Promise<string> {
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    return sentences.slice(0, maxSentences).join(" ") || "[mock summary — no content to summarize]";
  }

  async recommend(context: string): Promise<ClauseSuggestion[]> {
    return [
      {
        clauseTitle: "Standard confidentiality clause (mock suggestion)",
        clauseText: "The parties agree to keep the terms of this agreement confidential.",
        relevance: 0.8,
      },
    ].filter(() => context.length >= 0);
  }

  async summarizeMatter(matterId: string, recentActivity: string[]): Promise<string> {
    if (recentActivity.length === 0) return `[mock] No recent activity to summarize for matter ${matterId}.`;
    return `[mock matter summary] Matter ${matterId} has ${recentActivity.length} recent activity item(s), most recently: "${recentActivity[0]}".`;
  }
}
