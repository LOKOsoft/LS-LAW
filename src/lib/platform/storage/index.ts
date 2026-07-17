import { appConfig } from "@/lib/platform/config";
import { LocalStorageAdapter } from "@/lib/platform/storage/local-storage-adapter";
import { CloudStorageAdapterPlaceholder } from "@/lib/platform/storage/cloud-storage-adapter-placeholder";
import type { StorageProvider } from "@/lib/platform/storage/types";

export type { StorageProvider, StorageScope, SavedFile } from "@/lib/platform/storage/types";
export { LocalStorageAdapter } from "@/lib/platform/storage/local-storage-adapter";
export { CloudStorageAdapterPlaceholder } from "@/lib/platform/storage/cloud-storage-adapter-placeholder";

/** Resolves the active storage backend from config. Always `LocalStorageAdapter` until `LEXORA_STORAGE_PROVIDER` is set to something else *and* that adapter has a real implementation. */
export function getStorageProvider(): StorageProvider {
  const provider = appConfig.providers.storage;
  if (provider === "local") return new LocalStorageAdapter();
  return new CloudStorageAdapterPlaceholder(provider);
}
