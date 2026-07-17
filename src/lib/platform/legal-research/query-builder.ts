import type { CaseSearchQuery, QueryBuilder } from "@/lib/platform/legal-research/types";

export class CaseSearchQueryBuilder implements QueryBuilder {
  private query: CaseSearchQuery = { keywords: "" };

  withKeywords(keywords: string): this {
    this.query.keywords = keywords;
    return this;
  }

  withCourt(court: string): this {
    this.query.court = court;
    return this;
  }

  withYearRange(from: number, to: number): this {
    this.query.yearFrom = from;
    this.query.yearTo = to;
    return this;
  }

  build(): CaseSearchQuery {
    return { ...this.query };
  }
}
