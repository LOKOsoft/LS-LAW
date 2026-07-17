/** Real, active validation for the Documents upload path (`app/api/upload/route.ts`) — not a placeholder. Keeps obviously dangerous or oversized uploads out without adding a virus-scanning dependency. */

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

const BLOCKED_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "com", "scr", "msi", "dll", "sh", "ps1", "vbs", "js", "jar", "app",
]);

export type FileValidationResult = { valid: true } | { valid: false; reason: string };

export function validateUploadedFile(file: { name: string; size: number }): FileValidationResult {
  if (file.size <= 0) {
    return { valid: false, reason: "The file is empty." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { valid: false, reason: `File exceeds the ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB upload limit.` };
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { valid: false, reason: `Files with a ".${ext}" extension can't be uploaded.` };
  }
  return { valid: true };
}
