export {
  AppError,
  BusinessRuleError,
  ValidationError,
  DomainError,
  NotFoundError,
  ForbiddenError,
  RepositoryError,
  ProviderNotConfiguredError,
  isAppError,
} from "@/lib/platform/errors/domain-errors";
export { toUserFacingError, withRepositoryErrorHandling } from "@/lib/platform/errors/handler";
export type { UserFacingError } from "@/lib/platform/errors/handler";
