import type { ExpectedOutputShape, ResponseValidator } from "@/lib/platform/ai/prompt/types";

export interface ResponseParser<T = unknown> {
  parse(rawResponse: string): T;
}

/** Passes text through unchanged — the parser for `expectedOutput: "text"` prompts. */
export class TextResponseParser implements ResponseParser<string> {
  parse(rawResponse: string): string {
    return rawResponse.trim();
  }
}

/** Parses a JSON object out of a response, tolerating a provider wrapping it in prose or a fenced code block (common LLM behavior). Throws if no valid JSON is found. */
export class JsonResponseParser implements ResponseParser<unknown> {
  parse(rawResponse: string): unknown {
    const fenced = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1] : rawResponse;
    try {
      return JSON.parse(candidate.trim());
    } catch {
      throw new Error("Response did not contain valid JSON.");
    }
  }
}

/** Splits a response into a list — one item per non-empty line, stripping common bullet/numbering prefixes. */
export class ListResponseParser implements ResponseParser<string[]> {
  parse(rawResponse: string): string[] {
    return rawResponse
      .split("\n")
      .map((line) => line.replace(/^[\s*\-\d.)]+/, "").trim())
      .filter(Boolean);
  }
}

export function getResponseParser(shape: ExpectedOutputShape): ResponseParser {
  switch (shape) {
    case "json":
      return new JsonResponseParser();
    case "list":
      return new ListResponseParser();
    case "text":
    default:
      return new TextResponseParser();
  }
}

/** Default validator: for "json", confirms it parses; for "list", confirms at least one item; for "text", confirms it's non-empty. */
export class DefaultResponseValidator implements ResponseValidator {
  validate(rawResponse: string, expected: ExpectedOutputShape): { valid: boolean; reason?: string } {
    if (rawResponse.trim().length === 0) return { valid: false, reason: "Response was empty." };
    try {
      const parsed = getResponseParser(expected).parse(rawResponse);
      if (expected === "list" && Array.isArray(parsed) && parsed.length === 0) {
        return { valid: false, reason: "Expected a non-empty list." };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, reason: error instanceof Error ? error.message : "Failed to parse response." };
    }
  }
}
