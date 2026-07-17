export type ModelDescriptor = {
  id: string;
  providerName: string;
  displayName: string;
  /** Rough capability hint — not enforced, just surfaced in any future model-picker UI. */
  contextWindowTokens?: number;
};

/**
 * Tracks which models are available per provider and which one is
 * "active" — independent of which `AIProvider` implementation is wired up.
 * A provider (e.g. `LocalOllamaProvider`) asks the active `ModelManager`
 * which model id to request rather than hardcoding a model name.
 */
export class ModelManager {
  private readonly models = new Map<string, ModelDescriptor>();
  private activeModelId: string | null = null;

  register(model: ModelDescriptor): void {
    this.models.set(model.id, model);
    if (this.activeModelId === null) this.activeModelId = model.id;
  }

  list(providerName?: string): ModelDescriptor[] {
    const all = Array.from(this.models.values());
    return providerName ? all.filter((m) => m.providerName === providerName) : all;
  }

  setActive(modelId: string): void {
    if (!this.models.has(modelId)) throw new Error(`Unknown model id "${modelId}".`);
    this.activeModelId = modelId;
  }

  getActive(): ModelDescriptor | null {
    return this.activeModelId ? (this.models.get(this.activeModelId) ?? null) : null;
  }
}

export const modelManager = new ModelManager();

modelManager.register({ id: "mock-ai-v1", providerName: "mock", displayName: "Mock AI (deterministic, offline)" });
modelManager.register({ id: "llama3", providerName: "ollama", displayName: "Llama 3 (via Ollama)", contextWindowTokens: 8192 });
modelManager.register({ id: "mistral", providerName: "ollama", displayName: "Mistral (via Ollama)", contextWindowTokens: 8192 });
