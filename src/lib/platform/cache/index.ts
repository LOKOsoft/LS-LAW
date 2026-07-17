export type { CacheProvider } from "@/lib/platform/cache/types";
export { MemoryCacheProvider } from "@/lib/platform/cache/memory-cache-provider";
export { BrowserCacheProvider } from "@/lib/platform/cache/browser-cache-provider";
export { RedisCacheProviderPlaceholder } from "@/lib/platform/cache/redis-cache-provider-placeholder";
export { queryCache, searchCache, reportCache } from "@/lib/platform/cache/namespaces";
