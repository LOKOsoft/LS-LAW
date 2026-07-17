/**
 * Public API readiness (Step 10) — interfaces only, nothing implemented.
 * There is no public API surface in this app today; see docs/API_PREPARATION.md
 * for why and what a real one would need. This module exists so the shape
 * of "an external API client" already exists the day a real endpoint layer
 * is built.
 */

export type ApiKey = {
  id: string;
  /** Never the raw secret — a hash or last-4-chars display value, matching how a real implementation must never round-trip the plaintext key. */
  displayValue: string;
  /** Which tenant/firm this key acts on behalf of — always "default" until multi-tenancy is real. */
  tenantId: string;
  createdAt: Date;
  revokedAt: Date | null;
};

export type ApiClientContext = {
  apiKeyId: string;
  tenantId: string;
  /** Scopes this key is limited to, e.g. "matters:read" — mirrors the RBAC Permission shape. */
  scopes: string[];
};

/** What a real API-key auth layer must expose — a second `AuthProvider`-like source of identity, for callers that aren't a logged-in browser session. */
export interface ApiKeyAuthProvider {
  verify(rawKey: string): Promise<ApiClientContext | null>;
  issue(tenantId: string, scopes: string[]): Promise<{ apiKey: ApiKey; rawKey: string }>;
  revoke(apiKeyId: string): Promise<void>;
}
