import { appConfig } from "@/lib/platform/config";
import { MockAIProvider } from "@/lib/platform/ai/mock-ai-provider";
import type { AIProvider } from "@/lib/platform/ai/types";

export type {
  AIProvider,
  PromptRequest,
  PromptResponse,
  PromptService,
  EmbeddingService,
  VectorMatch,
  VectorSearchService,
  OCRResult,
  OCRService,
  TranscriptionResult,
  SpeechService,
  DocumentAnalysisResult,
  DocumentAnalysisService,
  SummarizationService,
  ClauseSuggestion,
  ClauseRecommendationService,
  MatterSummaryService,
} from "@/lib/platform/ai/types";
export { MockAIProvider } from "@/lib/platform/ai/mock-ai-provider";

/** Resolves the active AI provider from config — always mock until a real OpenAI/Anthropic/Gemini adapter is written. */
export function getAIProvider(): AIProvider {
  if (appConfig.providers.ai !== "mock") {
    throw new Error(`AI provider "${appConfig.providers.ai}" has no real implementation yet — only "mock" is available.`);
  }
  return new MockAIProvider();
}
