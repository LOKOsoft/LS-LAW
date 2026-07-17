"use client";

import type { CacheProvider } from "@/lib/platform/cache/types";

type StoredValue = { value: unknown; expiresAt: number | null };

/** Client-side cache backed by `localStorage`. For UI-only caching (e.g. remembering the last-used filter set) — never store server data a permission check should gate, since it persists across sessions in plaintext. */
export class BrowserCacheProvider implements CacheProvider {
  constructor(private readonly namespace = "lexora:cache:") {}

  async get<T>(key: string): Promise<T | undefined> {
    if (typeof window === "undefined") return undefined;
    const raw = window.localStorage.getItem(this.namespace + key);
    if (!raw) return undefined;
    let parsed: StoredValue;
    try {
      parsed = JSON.parse(raw) as StoredValue;
    } catch {
      // Malformed entry (hand-edited, corrupted, or written by an older/incompatible version) — treat as a cache miss rather than throwing.
      window.localStorage.removeItem(this.namespace + key);
      return undefined;
    }
    if (parsed.expiresAt !== null && parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(this.namespace + key);
      return undefined;
    }
    return parsed.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (typeof window === "undefined") return;
    const entry: StoredValue = { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null };
    window.localStorage.setItem(this.namespace + key, JSON.stringify(entry));
  }

  async delete(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(this.namespace + key);
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith(this.namespace)) window.localStorage.removeItem(key);
    }
  }
}
