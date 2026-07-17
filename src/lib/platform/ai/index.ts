import { appConfig } from "@/lib/platform/config";
import { MockAIProvider } from "@/lib/platform/ai/mock-ai-provider";
import { LocalOllamaProvider } from "@/lib/platform/ai/providers/local-ollama-provider";
import { LmStudioProviderPlaceholder, LlamaCppProviderPlaceholder } from "@/lib/platform/ai/providers/local-runtime-placeholders";
import { CloudProviderPlaceholder } from "@/lib/platform/ai/providers/cloud-provider-placeholder";
import { FallbackAIProvider } from "@/lib/platform/ai/fallback";
import type { AIProvider } from "@/lib/platform/ai/types";
import "@/lib/platform/ai/prompt/templates"; // registers every prompt template as a side effect of import

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
export { LocalOllamaProvider } from "@/lib/platform/ai/providers/local-ollama-provider";
export { LmStudioProviderPlaceholder, LlamaCppProviderPlaceholder } from "@/lib/platform/ai/providers/local-runtime-placeholders";
export { CloudProviderPlaceholder } from "@/lib/platform/ai/providers/cloud-provider-placeholder";
export { FallbackAIProvider } from "@/lib/platform/ai/fallback";
export { AIPipeline } from "@/lib/platform/ai/pipeline";
export type { PipelineResult } from "@/lib/platform/ai/pipeline";
export { promptRegistry, PromptRegistry, MissingPromptVariableError } from "@/lib/platform/ai/prompt/registry";
export type { PromptTemplate, PromptVariable } from "@/lib/platform/ai/prompt/types";
export { modelManager, ModelManager } from "@/lib/platform/ai/model-manager";
export type { ModelDescriptor } from "@/lib/platform/ai/model-manager";
export {
  TextResponseParser,
  JsonResponseParser,
  ListResponseParser,
  DefaultResponseValidator,
  getResponseParser,
} from "@/lib/platform/ai/prompt/response-parser";

function buildProviderChain(): AIProvider[] {
  const selected = appConfig.providers.ai;
  const mock = new MockAIProvider();

  switch (selected) {
    case "ollama":
      return [new LocalOllamaProvider(), mock];
    case "lm-studio":
      return [new LmStudioProviderPlaceholder(), mock];
    case "llama-cpp":
      return [new LlamaCppProviderPlaceholder(), mock];
    case "openai":
    case "anthropic":
    case "gemini":
      // Cloud providers are never actually called — see CloudProviderPlaceholder's
      // own comment. It always throws, so the chain falls straight through to mock.
      return [new CloudProviderPlaceholder(selected), mock];
    case "mock":
    default:
      return [mock];
  }
}

/**
 * Resolves the active AI provider from config, wrapped in `FallbackAIProvider`
 * so a misconfigured or unreachable local/cloud provider always degrades to
 * `MockAIProvider` rather than throwing. This is the one function feature
 * code should call — never `new MockAIProvider()`/`new LocalOllamaProvider()`
 * directly, so provider selection stays centralized in config.
 */
export function getAIProvider(): AIProvider {
  return new FallbackAIProvider(buildProviderChain());
}
