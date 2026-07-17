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
 * Placeholders for other on-device model runtimes (Step 13). Unlike
 * `LocalOllamaProvider`, these don't make real HTTP calls yet — LM Studio and
 * llama.cpp both expose an OpenAI-compatible HTTP API, so a real
 * implementation would look almost identical to `LocalOllamaProvider` (same
 * localhost-only fetch pattern, different endpoint shape). Kept as explicit
 * placeholders rather than one generic "local LLM" class so each gets its
 * own real class to fill in later without a refactor.
 */
abstract class LocalRuntimePlaceholder implements AIProvider {
  abstract readonly name: "lm-studio" | "llama-cpp";

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

/** LM Studio (https://lmstudio.ai) exposes an OpenAI-compatible local server, typically at http://localhost:1234. */
export class LmStudioProviderPlaceholder extends LocalRuntimePlaceholder {
  readonly name = "lm-studio" as const;
}

/** llama.cpp's server mode exposes a local HTTP API, typically at http://localhost:8080. */
export class LlamaCppProviderPlaceholder extends LocalRuntimePlaceholder {
  readonly name = "llama-cpp" as const;
}
