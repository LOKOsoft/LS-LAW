import type { CaseSearchProvider, CaseSearchResult } from "@/lib/platform/legal-research/types";
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";

/** Searches nothing — returns an empty result set so calling UI can render a real "no results" state rather than fabricated case law, which would be actively harmful in a legal product. */
export class MockCaseSearchProvider implements CaseSearchProvider {
  readonly name = "mock";

  async search(): Promise<CaseSearchResult[]> {
    return [];
  }
}

/**
 * Named placeholders for real Indian legal-database integrations (given this
 * app's seeded demo firm operates under Indian courts/currency/timezone —
 * see docs/CONFIGURATION.md). Both throw; a real integration would replace
 * the body of `search()` with that provider's real API/scraper client.
 */
export class IndianKanoonAdapterPlaceholder implements CaseSearchProvider {
  readonly name = "indian-kanoon";

  async search(): Promise<CaseSearchResult[]> {
    throw new ProviderNotConfiguredError("Case search", this.name);
  }
}

export class SccOnlineAdapterPlaceholder implements CaseSearchProvider {
  readonly name = "scc-online";

  async search(): Promise<CaseSearchResult[]> {
    throw new ProviderNotConfiguredError("Case search", this.name);
  }
}
