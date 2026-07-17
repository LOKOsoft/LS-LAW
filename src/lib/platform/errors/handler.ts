import { AppError, BusinessRuleError, RepositoryError, isAppError } from "@/lib/platform/errors/domain-errors";
import { logger } from "@/lib/platform/logging/logger";

export type UserFacingError = {
  message: string;
  code: string;
  statusCode: number;
  fieldErrors?: Record<string, string[]>;
};

const GENERIC_MESSAGE = "Something went wrong. Please try again, or contact support if the problem persists.";

/**
 * Normalizes any thrown value into a safe, user-facing shape and logs the
 * original error. Server Actions/route handlers should funnel their catch
 * blocks through this instead of re-throwing raw driver/library errors.
 */
export function toUserFacingError(error: unknown, context?: Record<string, unknown>): UserFacingError {
  if (error instanceof BusinessRuleError) {
    return { message: error.message, code: "BUSINESS_RULE_ERROR", statusCode: 422 };
  }

  if (isAppError(error)) {
    logger.error(error.userFacing ? "handled_app_error" : "unhandled_internal_error", error, context);
    return {
      message: error.userFacing ? error.message : GENERIC_MESSAGE,
      code: error.code,
      statusCode: error.statusCode,
      fieldErrors: error instanceof AppError && "fieldErrors" in error ? (error as { fieldErrors?: Record<string, string[]> }).fieldErrors : undefined,
    };
  }

  logger.error("unexpected_error", error, context);
  return { message: GENERIC_MESSAGE, code: "INTERNAL_ERROR", statusCode: 500 };
}

/** Wraps a Prisma/data-access call so failures surface as a typed RepositoryError instead of a raw driver error leaking to the UI. */
export async function withRepositoryErrorHandling<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof RepositoryError) throw error;
    throw new RepositoryError(errorMessage, error);
  }
}
