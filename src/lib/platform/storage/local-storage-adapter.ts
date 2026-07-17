import { saveFileToStorage, extensionOf } from "@/lib/storage/local-storage";
import type { SavedFile, StorageProvider, StorageScope } from "@/lib/platform/storage/types";

/** Thin wrapper over the real, working `src/lib/storage/local-storage.ts` — behavior is identical to before this file existed; it exists only so call sites can depend on `StorageProvider` instead of the concrete local implementation. */
export class LocalStorageAdapter implements StorageProvider {
  async save(scope: StorageScope, ownerId: string, fileName: string, bytes: Buffer): Promise<SavedFile> {
    const { absolutePath, storagePath } = await saveFileToStorage(scope, ownerId, fileName, bytes);
    return { location: absolutePath, storagePath };
  }

  extensionOf(fileName: string): string {
    return extensionOf(fileName);
  }
}
