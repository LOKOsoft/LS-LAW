import type {
  AmountDetectionService,
  DateDetectionService,
  DetectedAmount,
  DetectedParty,
  DocumentClassification,
  DocumentClassificationService,
  ExtractedMetadata,
  MetadataExtractionService,
  NamedEntity,
  NamedEntityExtractionService,
  PartyDetectionService,
  SignatureDetectionResult,
  SignatureDetectionService,
  VersionComparisonService,
  VersionComparisonSummary,
} from "@/lib/platform/ai/document-analysis/types";

const DOCUMENT_TYPE_KEYWORDS: Record<string, string[]> = {
  "Non-Disclosure Agreement": ["confidential", "non-disclosure", "nda"],
  "Employment Agreement": ["employee", "employment", "salary", "probation"],
  "Lease Agreement": ["lessor", "lessee", "premises", "rent"],
  "Power of Attorney": ["power of attorney", "attorney-in-fact", "principal"],
  "Legal Notice": ["notice is hereby given", "you are hereby notified"],
  Affidavit: ["affidavit", "deponent", "solemnly affirm"],
  Will: ["last will and testament", "bequeath", "executor"],
};

/** Keyword-scoring classifier — real NLP classification would replace this body without changing the interface. */
export class MockDocumentClassificationService implements DocumentClassificationService {
  async classify(text: string): Promise<DocumentClassification> {
    const lower = text.toLowerCase();
    let best: { type: string; hits: number } = { type: "Unclassified", hits: 0 };
    for (const [type, keywords] of Object.entries(DOCUMENT_TYPE_KEYWORDS)) {
      const hits = keywords.filter((k) => lower.includes(k)).length;
      if (hits > best.hits) best = { type, hits };
    }
    return { documentType: best.type, confidence: best.hits === 0 ? 0 : Math.min(1, best.hits / 3) };
  }
}

export class MockMetadataExtractionService implements MetadataExtractionService {
  async extractMetadata(text: string): Promise<ExtractedMetadata> {
    const firstLine = text.split("\n").find((line) => line.trim().length > 0);
    return {
      title: firstLine?.trim().slice(0, 120),
      wordCount: text.split(/\s+/).filter(Boolean).length,
      language: "en",
    };
  }
}

/** Regex-based heuristic NER — flags capitalized multi-word phrases as candidate entities. A real NER model would replace this with actual named-entity recognition. */
export class MockNamedEntityExtractionService implements NamedEntityExtractionService {
  async extractEntities(text: string): Promise<NamedEntity[]> {
    const matches = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g) ?? [];
    const seen = new Set<string>();
    const entities: NamedEntity[] = [];
    for (const match of matches) {
      if (seen.has(match)) continue;
      seen.add(match);
      const type = /\b(Ltd|LLP|LLC|Inc|Corporation|Company|Pvt)\b/.test(match) ? "ORGANIZATION" : "PERSON";
      entities.push({ type, value: match });
    }
    return entities.slice(0, 25);
  }
}

export class MockDateDetectionService implements DateDetectionService {
  async detectDates(text: string): Promise<Date[]> {
    const pattern = /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})\b/gi;
    const matches = text.match(pattern) ?? [];
    return matches.map((m) => new Date(m)).filter((d) => !Number.isNaN(d.getTime()));
  }
}

const CURRENCY_SYMBOLS: Record<string, string> = { "₹": "INR", $: "USD", "€": "EUR", "£": "GBP" };

export class MockAmountDetectionService implements AmountDetectionService {
  async detectAmounts(text: string): Promise<DetectedAmount[]> {
    const pattern = /([₹$€£])\s?([\d,]+(?:\.\d{1,2})?)/g;
    const results: DetectedAmount[] = [];
    for (const match of text.matchAll(pattern)) {
      const value = Number(match[2].replace(/,/g, ""));
      if (Number.isNaN(value)) continue;
      results.push({ raw: match[0], value, currency: CURRENCY_SYMBOLS[match[1]] ?? null });
    }
    return results;
  }
}

export class MockPartyDetectionService implements PartyDetectionService {
  async detectParties(text: string): Promise<DetectedParty[]> {
    const parties: DetectedParty[] = [];
    const firstPartyMatch = text.match(/(?:between|by and between)\s+([A-Z][\w.&\s]{2,60}?)(?:\s+and\b)/i);
    const secondPartyMatch = text.match(/\band\s+([A-Z][\w.&\s]{2,60}?)(?:\s*[,.\n]|$)/);
    if (firstPartyMatch) parties.push({ name: firstPartyMatch[1].trim(), role: "FIRST_PARTY" });
    if (secondPartyMatch) parties.push({ name: secondPartyMatch[1].trim(), role: "SECOND_PARTY" });
    return parties;
  }
}

export class MockSignatureDetectionService implements SignatureDetectionService {
  async detectSignatures(text: string): Promise<SignatureDetectionResult> {
    const matches = text.match(/\b(signature|signed|witness)\b/gi) ?? [];
    return { hasSignatureBlock: matches.length > 0, signatureCount: matches.length };
  }
}

export class MockVersionComparisonService implements VersionComparisonService {
  async compareVersions(oldText: string, newText: string): Promise<VersionComparisonSummary> {
    const oldWords = oldText.split(/\s+/).filter(Boolean);
    const newWords = newText.split(/\s+/).filter(Boolean);
    const longer = Math.max(oldWords.length, newWords.length, 1);
    const changed = Math.abs(newWords.length - oldWords.length);
    const changePercentage = Math.min(100, Math.round((changed / longer) * 100));
    return {
      changePercentage,
      summary: `Approximately ${changePercentage}% word-count change between versions (${oldWords.length} → ${newWords.length} words). For a real added/removed/modified breakdown, use the Document Generator's built-in comparison engine on generated document text.`,
    };
  }
}
