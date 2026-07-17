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
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";
import { modelManager } from "@/lib/platform/ai/model-manager";
import { logger } from "@/lib/platform/logging/logger";

const OLLAMA_BASE_URL = "http://127.0.0.1:11434";
const REQUEST_TIMEOUT_MS = 5000;

async function ollamaFetch(path: string, body: unknown): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Ollama responded with HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    logger.warn("ollama_request_failed", { path, error: error instanceof Error ? error.message : String(error) });
    throw new ProviderNotConfiguredError("AI", "ollama");
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * A genuinely real, local-only provider — talks to a locally-running Ollama
 * instance (https://ollama.com) over `127.0.0.1`, never the public internet.
 * If Ollama isn't installed/running, every call fails fast (5s timeout) with
 * `ProviderNotConfiguredError`, which `FallbackAIProvider` (see `fallback.ts`)
 * catches and routes to the next provider in the chain (ultimately
 * `MockAIProvider`) — so selecting `LEXORA_AI_PROVIDER=ollama` without Ollama
 * actually running degrades gracefully instead of breaking the app.
 *
 * Only `complete`, `summarize`, and `embed` are implemented against Ollama's
 * real API (`/api/generate`, `/api/embeddings`) — Ollama has no built-in
 * OCR/speech/document-analysis endpoints, so those methods intentionally
 * throw and fall back to the mock provider rather than pretending to
 * support them.
 */
export class LocalOllamaProvider implements AIProvider {
  readonly name = "ollama" as const;

  private activeModel(): string {
    const model = modelManager.getActive();
    return model && model.providerName === "ollama" ? model.id : "llama3";
  }

  async complete(request: PromptRequest): Promise<PromptResponse> {
    const model = this.activeModel();
    const result = (await ollamaFetch("/api/generate", { model, prompt: request.prompt, stream: false })) as {
      response?: string;
    };
    return { text: result.response ?? "", model: `ollama:${model}` };
  }

  async summarize(text: string, maxSentences = 3): Promise<string> {
    const { text: response } = await this.complete({
      prompt: `Summarize the following in at most ${maxSentences} sentences:\n\n${text}`,
    });
    return response;
  }

  async embed(text: string): Promise<number[]> {
    const model = this.activeModel();
    const result = (await ollamaFetch("/api/embeddings", { model, prompt: text })) as { embedding?: number[] };
    if (!result.embedding) throw new ProviderNotConfiguredError("AI", "ollama");
    return result.embedding;
  }

  async search(): Promise<VectorMatch[]> {
    throw new ProviderNotConfiguredError("AI", "ollama");
  }
  async extractText(): Promise<OCRResult> {
    throw new ProviderNotConfiguredError("AI", "ollama");
  }
  async transcribe(): Promise<TranscriptionResult> {
    throw new ProviderNotConfiguredError("AI", "ollama");
  }
  async analyze(): Promise<DocumentAnalysisResult> {
    throw new ProviderNotConfiguredError("AI", "ollama");
  }
  async recommend(): Promise<ClauseSuggestion[]> {
    throw new ProviderNotConfiguredError("AI", "ollama");
  }
  async summarizeMatter(matterId: string, recentActivity: string[]): Promise<string> {
    return this.summarize(`Matter ${matterId} recent activity:\n${recentActivity.join("\n")}`);
  }
}
