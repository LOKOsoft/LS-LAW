export { RateLimiter, loginRateLimiter } from "@/lib/platform/security/rate-limiter";
export { NoopEncryptionService, getEncryptionService } from "@/lib/platform/security/encryption";
export type { EncryptionService } from "@/lib/platform/security/encryption";
export { validateUploadedFile } from "@/lib/platform/security/file-validation";
export type { FileValidationResult } from "@/lib/platform/security/file-validation";
export { buildContentSecurityPolicy, SECURITY_HEADERS } from "@/lib/platform/security/headers";
