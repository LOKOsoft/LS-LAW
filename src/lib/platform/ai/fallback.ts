import { logger } from "@/lib/platform/logging/logger";
import { isAppError } from "@/lib/platform/errors/domain-errors";
import type { AIProvider } from "@/lib/platform/ai/types";

type AsyncMethodNames<T> = { [K in keyof T]: T[K] extends (...args: never[]) => Promise<unknown> ? K : never }[keyof T];
type ProviderMethod = AsyncMethodNames<AIProvider>;

/**
 * Composes an ordered list of providers into one `AIProvider` — for each
 * call, tries providers in order and moves to the next on failure (a
 * provider being unreachable, unimplemented for that method, or throwing
 * `ProviderNotConfiguredError`). The last provider in the chain should
 * always be one that can't fail (`MockAIProvider`), so a `FallbackAIProvider`
 * built with it can never itself throw — this is what lets
 * `LEXORA_AI_PROVIDER=ollama` degrade to mock responses instead of crashing
 * the feature calling it when Ollama isn't running.
 */
export class FallbackAIProvider implements AIProvider {
  readonly name: AIProvider["name"];

  constructor(private readonly providers: AIProvider[]) {
    if (providers.length === 0) throw new Error("FallbackAIProvider needs at least one provider.");
    this.name = providers[0].name;
  }

  private async tryEach<M extends ProviderMethod>(method: M, args: Parameters<AIProvider[M]>): Promise<Awaited<ReturnType<AIProvider[M]>>> {
    let lastError: unknown;
    for (const provider of this.providers) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await (provider[method] as any)(...args);
      } catch (error) {
        lastError = error;
        logger.debug("ai_provider_fallback", {
          method,
          failedProvider: provider.name,
          reason: isAppError(error) ? error.message : String(error),
        });
      }
    }
    throw lastError;
  }

  complete: AIProvider["complete"] = (...args) => this.tryEach("complete", args);
  embed: AIProvider["embed"] = (...args) => this.tryEach("embed", args);
  search: AIProvider["search"] = (...args) => this.tryEach("search", args);
  extractText: AIProvider["extractText"] = (...args) => this.tryEach("extractText", args);
  transcribe: AIProvider["transcribe"] = (...args) => this.tryEach("transcribe", args);
  analyze: AIProvider["analyze"] = (...args) => this.tryEach("analyze", args);
  summarize: AIProvider["summarize"] = (...args) => this.tryEach("summarize", args);
  recommend: AIProvider["recommend"] = (...args) => this.tryEach("recommend", args);
  summarizeMatter: AIProvider["summarizeMatter"] = (...args) => this.tryEach("summarizeMatter", args);
}
