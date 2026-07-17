/** Every interface here is fully mocked today (`MockAIProvider`) — no network calls, no API keys read, no real model inference. Swapping in a real provider means implementing `AIProvider` against a real SDK and changing `LEXORA_AI_PROVIDER`; call sites depend on these interfaces, not a concrete SDK. */

export interface PromptRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

export interface PromptResponse {
  text: string;
  model: string;
}

export interface PromptService {
  complete(request: PromptRequest): Promise<PromptResponse>;
}

export interface EmbeddingService {
  embed(text: string): Promise<number[]>;
}

export interface VectorMatch {
  id: string;
  score: number;
  text: string;
}

export interface VectorSearchService {
  search(query: string, topK?: number): Promise<VectorMatch[]>;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export interface OCRService {
  extractText(fileBytes: Buffer, mimeType: string): Promise<OCRResult>;
}

export interface TranscriptionResult {
  text: string;
  durationSeconds: number;
}

export interface SpeechService {
  transcribe(audioBytes: Buffer, mimeType: string): Promise<TranscriptionResult>;
}

export interface DocumentAnalysisResult {
  documentType: string;
  keyEntities: { label: string; value: string }[];
  risks: string[];
}

export interface DocumentAnalysisService {
  analyze(documentText: string): Promise<DocumentAnalysisResult>;
}

export interface SummarizationService {
  summarize(text: string, maxSentences?: number): Promise<string>;
}

export interface ClauseSuggestion {
  clauseTitle: string;
  clauseText: string;
  relevance: number;
}

export interface ClauseRecommendationService {
  recommend(context: string): Promise<ClauseSuggestion[]>;
}

export interface MatterSummaryService {
  summarizeMatter(matterId: string, recentActivity: string[]): Promise<string>;
}

/** Umbrella provider a call site can depend on for every AI capability at once. `MockAIProvider` implements all of it. */
export interface AIProvider
  extends PromptService,
    EmbeddingService,
    VectorSearchService,
    OCRService,
    SpeechService,
    DocumentAnalysisService,
    SummarizationService,
    ClauseRecommendationService,
    MatterSummaryService {
  readonly name: "mock" | "openai" | "anthropic" | "gemini" | "ollama" | "lm-studio" | "llama-cpp";
}
