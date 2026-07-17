import type { PromptTemplate, PromptVariable, ProviderMapping } from "@/lib/platform/ai/prompt/types";

/** Thrown when a template is rendered without a value for one of its required variables. */
export class MissingPromptVariableError extends Error {
  constructor(promptId: string, variable: string) {
    super(`Prompt "${promptId}" is missing required variable "${variable}".`);
    this.name = "MissingPromptVariableError";
  }
}

/**
 * In-memory store of every prompt template used anywhere in the app —
 * the single place that answers "what exactly do we send the AI provider
 * for X". Templates are registered once at module load (see `templates.ts`)
 * and looked up by id everywhere else; nothing should inline a prompt string
 * at a call site.
 */
export class PromptRegistry {
  private readonly templates = new Map<string, PromptTemplate>();
  private readonly mappings: ProviderMapping[] = [];

  register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  get(id: string): PromptTemplate {
    const template = this.templates.get(id);
    if (!template) throw new Error(`No prompt template registered with id "${id}".`);
    return template;
  }

  list(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  mapProvider(promptId: string, providerName: string): void {
    this.mappings.push({ promptId, providerName });
  }

  providerFor(promptId: string): string | undefined {
    return this.mappings.findLast((m) => m.promptId === promptId)?.providerName;
  }

  /** Substitutes `{{variable}}` placeholders and throws if a required variable is missing. Unknown/optional variables left unfilled are replaced with an empty string. */
  render(id: string, variables: Record<string, string>): string {
    const template = this.get(id);
    for (const v of template.variables) {
      if (v.required && !(v.name in variables)) {
        throw new MissingPromptVariableError(id, v.name);
      }
    }
    return template.template.replace(/\{\{(\w+)\}\}/g, (_match, name: string) => variables[name] ?? "");
  }
}

export const promptRegistry = new PromptRegistry();

export type { PromptTemplate, PromptVariable };
