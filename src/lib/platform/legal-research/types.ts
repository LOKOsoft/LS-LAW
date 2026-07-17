/** Case-search abstraction (Step 8) — no external legal database is called. `MockCaseSearchProvider` searches nothing; the named adapter placeholders document where a real integration would plug in. */

export type CaseSearchQuery = {
  keywords: string;
  court?: string;
  yearFrom?: number;
  yearTo?: number;
};

export type CaseSearchResult = {
  caseTitle: string;
  citation: string;
  court: string;
  year: number;
  snippet: string;
};

export interface CaseSearchProvider {
  readonly name: string;
  search(query: CaseSearchQuery): Promise<CaseSearchResult[]>;
}

/** A structured query, built incrementally — the shape a future search-bar UI would populate before calling a `CaseSearchProvider`. */
export interface QueryBuilder {
  withKeywords(keywords: string): this;
  withCourt(court: string): this;
  withYearRange(from: number, to: number): this;
  build(): CaseSearchQuery;
}
