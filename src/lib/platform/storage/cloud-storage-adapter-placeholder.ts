import type { SavedFile, StorageProvider } from "@/lib/platform/storage/types";
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";

/**
 * Shared inert shape for cloud object-storage backends. A real integration
 * (S3, Azure Blob, GCS) would replace `save()`'s body with an SDK upload call
 * and return a URL/key instead of a local path — the `StorageProvider`
 * contract doesn't need to change for that to work, which is the point of
 * this abstraction.
 */
export class CloudStorageAdapterPlaceholder implements StorageProvider {
  constructor(private readonly providerName: "s3" | "azure-blob" | "gcs") {}

  async save(): Promise<SavedFile> {
    throw new ProviderNotConfiguredError("Storage", this.providerName);
  }

  extensionOf(fileName: string): string {
    const ext = fileName.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  }
}
