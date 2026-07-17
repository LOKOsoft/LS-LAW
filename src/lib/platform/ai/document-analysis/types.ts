/** Document Analysis Engine (Step 6) — every implementation here is a local placeholder using pattern-matching heuristics, not a trained model. Real OCR/NER would replace `MockOCRService`/`MockNamedEntityExtractionService` without changing these interfaces. */

export type DocumentClassification = {
  documentType: string;
  confidence: number;
};

export interface DocumentClassificationService {
  classify(text: string): Promise<DocumentClassification>;
}

export type ExtractedMetadata = {
  title?: string;
  wordCount: number;
  language: string;
};

export interface MetadataExtractionService {
  extractMetadata(text: string): Promise<ExtractedMetadata>;
}

export type NamedEntity = {
  type: "PERSON" | "ORGANIZATION" | "LOCATION" | "OTHER";
  value: string;
};

export interface NamedEntityExtractionService {
  extractEntities(text: string): Promise<NamedEntity[]>;
}

export interface DateDetectionService {
  detectDates(text: string): Promise<Date[]>;
}

export type DetectedAmount = {
  raw: string;
  value: number;
  currency: string | null;
};

export interface AmountDetectionService {
  detectAmounts(text: string): Promise<DetectedAmount[]>;
}

export type DetectedParty = {
  name: string;
  role: "FIRST_PARTY" | "SECOND_PARTY" | "UNKNOWN";
};

export interface PartyDetectionService {
  detectParties(text: string): Promise<DetectedParty[]>;
}

export type SignatureDetectionResult = {
  hasSignatureBlock: boolean;
  signatureCount: number;
};

export interface SignatureDetectionService {
  detectSignatures(text: string): Promise<SignatureDetectionResult>;
}

/**
 * Generic version-comparison interface for arbitrary (potentially binary,
 * needing OCR-extracted text) documents. The real, working diff engine for
 * documents this app actually has plain text for — generated documents from
 * the AI Document Generator — is `src/features/document-generator/compare.ts`,
 * not this mock. See docs/DOCUMENT_ANALYSIS.md and docs/DOCUMENT_GENERATION.md
 * for how the two relate.
 */
export type VersionComparisonSummary = {
  changePercentage: number;
  summary: string;
};

export interface VersionComparisonService {
  compareVersions(oldText: string, newText: string): Promise<VersionComparisonSummary>;
}
