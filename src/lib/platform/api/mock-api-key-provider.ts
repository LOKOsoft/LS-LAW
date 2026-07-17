import type { ApiClientContext, ApiKey, ApiKeyAuthProvider } from "@/lib/platform/api/types";
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";

/**
 * Inert — there is no public API to authenticate against yet. `verify()`
 * always returns null (no key is ever valid); `issue()`/`revoke()` throw.
 * A real implementation would hash+store keys (e.g. a new `ApiKey` Prisma
 * model) and verify against that — this class exists only so
 * `ApiKeyAuthProvider` has a default, safe (fails closed) implementation.
 */
export class MockApiKeyProvider implements ApiKeyAuthProvider {
  async verify(): Promise<ApiClientContext | null> {
    return null;
  }

  async issue(): Promise<{ apiKey: ApiKey; rawKey: string }> {
    throw new ProviderNotConfiguredError("Public API", "mock");
  }

  async revoke(): Promise<void> {
    throw new ProviderNotConfiguredError("Public API", "mock");
  }
}

export const apiKeyProvider: ApiKeyAuthProvider = new MockApiKeyProvider();
