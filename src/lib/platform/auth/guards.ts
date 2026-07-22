import { ForbiddenError } from "@/lib/platform/errors/domain-errors";
import { permissionService } from "@/lib/platform/auth/permission-service";
import { localAuthProvider } from "@/lib/platform/auth/local-provider-instance";
import type { PermissionCheck, UserContext } from "@/lib/platform/auth/types";

/** Reads the current session through the real auth stack; throws `ForbiddenError` (not a redirect) so callers outside a page tree can handle it. */
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

/**
 * Role-specific authorization layered on top of `requireUser()`. Page-level
 * `requireUser()` (redirect-based, in every role layout) plus nav-level
 * visibility establishes "is there a valid session"; `withPermission` adds
 * "does this specific role have matrix-level access to this action" for
 * Server Actions, which are independently-addressable POST endpoints once
 * their reference is known and can't rely on the rendering page's own
 * layout guard having run. Wired into `features/{matters,clients,clauses,
 * templates,matter-assistant}/actions.ts` — see docs/TECHNICAL_DEBT.md item
 * #20. `search/actions.ts`'s `globalSearch` deliberately isn't wrapped here:
 * it aggregates across many modules with no single matching moduleKey, and
 * would need per-result-type scoping to gate correctly, tracked as its own
 * debt item rather than force-fit to one moduleKey.
 */
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
