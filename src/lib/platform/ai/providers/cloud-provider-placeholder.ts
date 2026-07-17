import type {
  AIProvider,
  ClauseSuggestion,
  DocumentAnalysisResult,
  OCRResult,
  PromptResponse,
  TranscriptionResult,
  VectorMatch,
} from "@/lib/platform/ai/types";
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";

/**
 * Represents "some cloud LLM provider" (OpenAI/Anthropic/Gemini/Azure OpenAI/etc).
 * Deliberately not connected — per this project's architecture rule, no
 * cloud AI provider may be called. Every method throws. A real integration
 * would be a *new* class per provider (`OpenAIProvider`, `AnthropicProvider`,
 * ...) implementing `AIProvider` against that provider's real SDK — this
 * class only exists to document the shape and give
 * `getAIProvider()`/`FallbackAIProvider` something concrete to point at
 * when a cloud provider name is selected in config without one actually
 * being wired in.
 */
export class CloudProviderPlaceholder implements AIProvider {
  readonly name: "openai" | "anthropic" | "gemini";

  constructor(name: "openai" | "anthropic" | "gemini") {
    this.name = name;
  }

  private notConfigured(): never {
    throw new ProviderNotConfiguredError("AI", this.name);
  }

  async complete(): Promise<PromptResponse> {
    this.notConfigured();
  }
  async embed(): Promise<number[]> {
    this.notConfigured();
  }
  async search(): Promise<VectorMatch[]> {
    this.notConfigured();
  }
  async extractText(): Promise<OCRResult> {
    this.notConfigured();
  }
  async transcribe(): Promise<TranscriptionResult> {
    this.notConfigured();
  }
  async analyze(): Promise<DocumentAnalysisResult> {
    this.notConfigured();
  }
  async summarize(): Promise<string> {
    this.notConfigured();
  }
  async recommend(): Promise<ClauseSuggestion[]> {
    this.notConfigured();
  }
  async summarizeMatter(): Promise<string> {
    this.notConfigured();
  }
}
