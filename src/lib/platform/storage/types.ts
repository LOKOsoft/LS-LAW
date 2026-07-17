export type StorageScope = "matters" | "clients" | "templates";

export type SavedFile = {
  /** Absolute filesystem path (local provider) or provider-specific handle. */
  location: string;
  /** App-relative path suitable for building a serving URL, e.g. "storage/matters/m1/file.pdf". */
  storagePath: string;
};

/** Contract every storage backend implements. `LocalStorageAdapter` is the only real one today — cloud adapters are inert until credentials/SDKs are wired in. */
export interface StorageProvider {
  save(scope: StorageScope, ownerId: string, fileName: string, bytes: Buffer): Promise<SavedFile>;
  /** Human-readable file extension, e.g. "PDF" — used for icons/badges in the Documents UI. */
  extensionOf(fileName: string): string;
}
