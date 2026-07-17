import { ForbiddenError } from "@/lib/platform/errors/domain-errors";
import { permissionService } from "@/lib/platform/auth/permission-service";
import { localAuthProvider } from "@/lib/platform/auth/local-provider-instance";
import type { PermissionCheck, UserContext } from "@/lib/platform/auth/types";

/**
 * Guard placeholders for a future layer (API routes callable outside a
 * Server Component tree, or a hosted multi-tenant deployment) that can't
 * rely on every role's `layout.tsx` having already called `requireUser()`.
 *
 * Not wired into any existing route or Server Action — today's authorization
 * is `requireUser()` (redirect-based, in every role layout) plus nav-level
 * visibility. Wiring `withPermission` into each module's actions.ts call
 * sites is real follow-up work, not done here, since it would mean auditing
 * every action's call sites for how the caller's `UserContext` gets passed
 * in — out of scope for scaffolding.
 */
export async function requireCurrentUser(): Promise<UserContext> {
  const user = await localAuthProvider.getCurrentUser();
  if (!user) throw new ForbiddenError("No active session.");
  return user;
}

export function assertPermission(user: UserContext, check: PermissionCheck): void {
  if (!permissionService.can(user, check)) {
    throw new ForbiddenError(`Role "${user.role}" does not have "${check.action}" access to "${check.moduleKey}".`);
  }
}

/** Wraps a Server Action so it throws `ForbiddenError` up front if the current user lacks the required access — opt-in, not applied automatically to any existing action. */
export function withPermission<Args extends unknown[], Result>(
  check: PermissionCheck,
  action: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return async (...args: Args) => {
    const user = await requireCurrentUser();
    assertPermission(user, check);
    return action(...args);
  };
}
