import { BusinessRuleError } from "@/lib/services/errors";

// Re-exported so callers can import every error type from one place
// (`@/lib/platform/errors`) without needing to know BusinessRuleError lives
// in the real services layer.
export { BusinessRuleError };

/** Base class for every typed error in this layer — carries a stable `code` for client-side handling and a `statusCode` for API routes. */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  /** True if this error is safe to show verbatim to end users (vs. a generic "something went wrong"). */
  readonly userFacing: boolean;

  constructor(message: string, userFacing = true) {
    super(message);
    this.name = this.constructor.name;
    this.userFacing = userFacing;
  }
}

/** Input failed schema/shape validation (Zod, form input, etc.). */
export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message, true);
    this.fieldErrors = fieldErrors;
  }
}

/** A business rule was violated (wraps the existing BusinessRuleError so both can be caught as one type going forward). */
export class DomainError extends AppError {
  readonly code = "DOMAIN_ERROR";
  readonly statusCode = 422;

  constructor(message: string) {
    super(message, true);
  }
}

/** The requested entity does not exist. */
export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;

  constructor(entity: string, id?: string) {
    super(id ? `${entity} "${id}" was not found.` : `${entity} was not found.`, true);
  }
}

/** Caller is authenticated but not permitted to perform this action — distinct from "not logged in", which the real auth layer (`requireUser`) already handles via redirect. */
export class ForbiddenError extends AppError {
  readonly code = "FORBIDDEN";
  readonly statusCode = 403;

  constructor(message = "You don't have permission to perform this action.") {
    super(message, true);
  }
}

/** A data-access call (Prisma) failed for reasons other than "not found" — connection issues, constraint violations, etc. Not user-facing by default since the raw driver message may leak schema details. */
export class RepositoryError extends AppError {
  readonly code = "REPOSITORY_ERROR";
  readonly statusCode = 500;
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message, false);
    this.cause = cause;
  }
}

/** A future-integration provider (payment, AI, cloud storage, etc.) was selected in config but has no real implementation wired in yet. */
export class ProviderNotConfiguredError extends AppError {
  readonly code = "PROVIDER_NOT_CONFIGURED";
  readonly statusCode = 501;

  constructor(capability: string, provider: string) {
    super(`${capability} provider "${provider}" is not configured — falling back is expected locally.`, false);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
