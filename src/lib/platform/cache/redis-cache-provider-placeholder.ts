import type { CacheProvider } from "@/lib/platform/cache/types";
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";

/** Inert until a real `redis`/`ioredis` client is wired in — throws rather than silently behaving like a no-op cache, so a misconfiguration is loud instead of just "caching doesn't seem to work." */
export class RedisCacheProviderPlaceholder implements CacheProvider {
  async get<T>(): Promise<T | undefined> {
    throw new ProviderNotConfiguredError("Cache", "redis");
  }
  async set(): Promise<void> {
    throw new ProviderNotConfiguredError("Cache", "redis");
  }
  async delete(): Promise<void> {
    throw new ProviderNotConfiguredError("Cache", "redis");
  }
  async clear(): Promise<void> {
    throw new ProviderNotConfiguredError("Cache", "redis");
  }
}
