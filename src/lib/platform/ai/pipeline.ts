import type { AIProvider } from "@/lib/platform/ai/types";
import { PromptRegistry, promptRegistry } from "@/lib/platform/ai/prompt/registry";
import { getResponseParser, DefaultResponseValidator } from "@/lib/platform/ai/prompt/response-parser";
import type { ResponseValidator } from "@/lib/platform/ai/prompt/types";
import { logger } from "@/lib/platform/logging/logger";

export type PipelineResult<T = unknown> = {
  promptId: string;
  raw: string;
  parsed: T;
  model: string;
};

/**
 * Orchestrates a single AI interaction end to end: render a registered
 * prompt template with variables → send through a provider → validate the
 * raw response → parse it into the expected shape. Every dependency is
 * injected via the constructor (provider, registry, validator) — nothing
 * here reaches for a singleton, so a caller can swap in a fake provider/
 * registry for a test without touching this class.
 */
export class AIPipeline {
  constructor(
    private readonly provider: AIProvider,
    private readonly registry: PromptRegistry = promptRegistry,
    private readonly validator: ResponseValidator = new DefaultResponseValidator(),
  ) {}

  async run<T = unknown>(promptId: string, variables: Record<string, string>): Promise<PipelineResult<T>> {
    const template = this.registry.get(promptId);
    const prompt = this.registry.render(promptId, variables);

    const { text, model } = await this.provider.complete({ prompt });

    const validation = this.validator.validate(text, template.expectedOutput);
    if (!validation.valid) {
      logger.warn("ai_pipeline_validation_failed", { promptId, reason: validation.reason });
    }

    const parsed = getResponseParser(template.expectedOutput).parse(text) as T;
    return { promptId, raw: text, parsed, model };
  }
}
