import path from "node:path";
import fs from "node:fs/promises";

export const STORAGE_ROOT = path.join(process.cwd(), "storage");

function sanitizeSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/** Resolves a storage-relative path and guarantees it stays inside STORAGE_ROOT. */
export function resolveStoragePath(...segments: string[]): string {
  const resolved = path.join(STORAGE_ROOT, ...segments.map(sanitizeSegment));
  if (!resolved.startsWith(STORAGE_ROOT)) {
    throw new Error("Invalid storage path");
  }
  return resolved;
}

export async function saveFileToStorage(
  scope: "matters" | "clients" | "templates",
  ownerId: string,
  fileName: string,
  bytes: Buffer,
): Promise<{ absolutePath: string; storagePath: string }> {
  const safeName = sanitizeSegment(fileName);
  const absolutePath = resolveStoragePath(scope, ownerId, safeName);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, bytes);
  const storagePath = path.posix.join("storage", scope, ownerId, safeName);
  return { absolutePath, storagePath };
}

export function extensionOf(fileName: string): string {
  const ext = path.extname(fileName).replace(".", "").toUpperCase();
  return ext || "FILE";
}
