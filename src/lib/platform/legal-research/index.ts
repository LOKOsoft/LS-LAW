export type { CaseSearchProvider, CaseSearchQuery, CaseSearchResult, QueryBuilder } from "@/lib/platform/legal-research/types";
export { CaseSearchQueryBuilder } from "@/lib/platform/legal-research/query-builder";
export {
  MockCaseSearchProvider,
  IndianKanoonAdapterPlaceholder,
  SccOnlineAdapterPlaceholder,
} from "@/lib/platform/legal-research/providers";

import { MockCaseSearchProvider } from "@/lib/platform/legal-research/providers";
import type { CaseSearchProvider } from "@/lib/platform/legal-research/types";

/** Always resolves to the mock provider today — no real legal database is connected. See docs/KNOWLEDGE_ENGINE.md. */
export function getCaseSearchProvider(): CaseSearchProvider {
  return new MockCaseSearchProvider();
}
