/** Centralized AI prompt management (Step 12's requirements live here, alongside the rest of the prompt engine). */

export type PromptVariable = {
  name: string;
  description: string;
  required: boolean;
};

/** What shape a provider's raw response is expected to take, so `ResponseParser` implementations know how to validate it. */
export type ExpectedOutputShape = "text" | "json" | "list";

export type PromptTemplate = {
  id: string;
  /** Bumped whenever the template text changes — old versions are kept in the registry for reproducibility/audit, never deleted. */
  version: number;
  description: string;
  variables: PromptVariable[];
  /** Template text with `{{variableName}}` placeholders. */
  template: string;
  expectedOutput: ExpectedOutputShape;
  /** Which AIProvider capability this prompt is meant to be sent through — documents intent, doesn't enforce it. */
  capability: "complete" | "summarize" | "analyze" | "recommend";
};

export interface ResponseValidator {
  validate(rawResponse: string, expected: ExpectedOutputShape): { valid: boolean; reason?: string };
}

/** Which concrete provider a prompt template is currently routed through — lets provider-specific prompt tuning (e.g. a template written for Ollama's instruction format) be recorded without scattering `if (provider === ...)` checks through call sites. */
export type ProviderMapping = {
  promptId: string;
  providerName: string;
};
