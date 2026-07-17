import { promptRegistry } from "@/lib/platform/ai/prompt/registry";

/**
 * Every prompt template the app knows about, registered once at import time.
 * The text is real and provider-agnostic — usable as-is the day a real LLM
 * provider is wired in behind `AIProvider`; `MockAIProvider` doesn't send
 * these anywhere today; it returns canned responses without reading the
 * rendered prompt. See docs/PROMPT_LIBRARY.md.
 */

promptRegistry.register({
  id: "matter.summarize",
  version: 1,
  description: "Summarize a matter's current state for a fee-earner picking it up cold.",
  variables: [
    { name: "matterTitle", description: "The matter's title", required: true },
    { name: "clientName", description: "The client's name", required: true },
    { name: "stage", description: "Current pipeline stage", required: true },
    { name: "recentActivity", description: "Newline-separated recent activity items", required: false },
  ],
  template:
    "Summarize the current state of matter \"{{matterTitle}}\" for client {{clientName}}, currently at stage {{stage}}. Recent activity:\n{{recentActivity}}\n\nProduce a 3-5 sentence summary a fee-earner unfamiliar with the matter could use to get oriented, highlighting anything time-sensitive.",
  expectedOutput: "text",
  capability: "summarize",
});

promptRegistry.register({
  id: "matter.meeting-brief",
  version: 1,
  description: "Generate a one-page brief ahead of a client meeting.",
  variables: [
    { name: "matterTitle", description: "The matter's title", required: true },
    { name: "openItems", description: "Newline-separated open items/questions", required: false },
  ],
  template:
    "Prepare a meeting brief for matter \"{{matterTitle}}\". Open items to address:\n{{openItems}}\n\nStructure as: Background, Status, Open items, Recommended talking points.",
  expectedOutput: "text",
  capability: "summarize",
});

promptRegistry.register({
  id: "document.summarize",
  version: 1,
  description: "Summarize a document's content.",
  variables: [
    { name: "documentName", description: "The document's file name", required: true },
    { name: "content", description: "Extracted document text", required: true },
  ],
  template: "Summarize the following document (\"{{documentName}}\") in plain language, 3 sentences maximum:\n\n{{content}}",
  expectedOutput: "text",
  capability: "summarize",
});

promptRegistry.register({
  id: "document.analyze",
  version: 1,
  description: "Extract structured metadata from a document's text.",
  variables: [{ name: "content", description: "Extracted document text", required: true }],
  template:
    "Analyze the following legal document text and extract: document type, parties involved, key dates, monetary amounts, and any obvious risks or missing elements. Return findings as a structured list.\n\n{{content}}",
  expectedOutput: "json",
  capability: "analyze",
});

promptRegistry.register({
  id: "clause.recommend",
  version: 1,
  description: "Recommend clauses relevant to a drafting context.",
  variables: [
    { name: "documentType", description: "The document being drafted", required: true },
    { name: "context", description: "Free-text description of the drafting context", required: true },
  ],
  template:
    "For a {{documentType}} with the following context: {{context}}\n\nRecommend clauses from the firm's clause library that should be included, and flag any commonly-required clauses that seem to be missing.",
  expectedOutput: "list",
  capability: "recommend",
});

promptRegistry.register({
  id: "research.summarize",
  version: 1,
  description: "Summarize research findings across multiple knowledge base articles.",
  variables: [
    { name: "query", description: "The research question", required: true },
    { name: "articleExcerpts", description: "Newline-separated excerpts from matched articles", required: true },
  ],
  template: "Research question: {{query}}\n\nRelevant excerpts:\n{{articleExcerpts}}\n\nSynthesize a concise research summary with citations to the source articles.",
  expectedOutput: "text",
  capability: "summarize",
});

promptRegistry.register({
  id: "risk.narrative",
  version: 1,
  description: "Turn a list of rule-engine risk findings into a plain-language narrative.",
  variables: [{ name: "findings", description: "Newline-separated risk findings", required: true }],
  template: "Explain the following risk findings for a matter in plain language a fee-earner can act on immediately:\n{{findings}}",
  expectedOutput: "text",
  capability: "summarize",
});

export { promptRegistry };
