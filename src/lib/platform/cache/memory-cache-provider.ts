import type { CacheProvider } from "@/lib/platform/cache/types";

type Entry = { value: unknown; expiresAt: number | null };

/** Process-local, in-memory TTL cache. Resets on server restart and isn't shared across instances — fine for a single-process local app; swap for `RedisCacheProviderPlaceholder` before running more than one instance. */
export class MemoryCacheProvider implements CacheProvider {
  private readonly store = new Map<string, Entry>();

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
