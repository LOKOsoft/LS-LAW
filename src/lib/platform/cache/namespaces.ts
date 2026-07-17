import { appConfig } from "@/lib/platform/config";
import { MemoryCacheProvider } from "@/lib/platform/cache/memory-cache-provider";
import { RedisCacheProviderPlaceholder } from "@/lib/platform/cache/redis-cache-provider-placeholder";
import type { CacheProvider } from "@/lib/platform/cache/types";

function createProvider(): CacheProvider {
  return appConfig.providers.cache === "redis" ? new RedisCacheProviderPlaceholder() : new MemoryCacheProvider();
}

// Separate instances per concern so clearing one (e.g. after a report definition
// changes) never evicts an unrelated cache. None of these are read from by any
// query today — they're available for a call site to opt into deliberately.
export const queryCache: CacheProvider = createProvider();
export const searchCache: CacheProvider = createProvider();
export const reportCache: CacheProvider = createProvider();
