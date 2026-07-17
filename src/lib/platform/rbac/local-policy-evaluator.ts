import { Role } from "@/generated/prisma/client";
import { permissionService } from "@/lib/platform/auth/permission-service";
import { ALL_MODULE_KEYS, type ModuleKey } from "@/lib/constants/nav";
import type { PermissionCheck, UserContext } from "@/lib/platform/auth/types";
import type { PolicyEvaluator, Permission, PermissionAction, RoleDefinition } from "@/lib/platform/rbac/types";

/**
 * Adapts the real, existing role/permission data (the 13 fixed `Role` enum
 * values + `permission-matrix.ts`) into the `PolicyEvaluator` shape — not a
 * second source of truth, a different-shaped read of the same one used by
 * `lib/platform/auth/permission-service.ts`. A future custom-RBAC
 * implementation (per-tenant roles stored in a new `Role`/`Permission`
 * table) would implement this same interface instead of reading `nav.ts`.
 */
export class LocalPolicyEvaluator implements PolicyEvaluator {
  can(roleId: string, permission: Permission): boolean {
    const role = Object.values(Role).find((r) => r === roleId);
    if (!role) return false;
    const user: UserContext = { id: "policy-check", email: "", name: "", role, clientId: null, firmId: "default" };
    const check: PermissionCheck = { moduleKey: permission.resource as ModuleKey, action: permission.action as PermissionAction };
    return permissionService.can(user, check);
  }

  getRole(roleId: string): RoleDefinition | null {
    const role = Object.values(Role).find((r) => r === roleId);
    if (!role) return null;
    const user: UserContext = { id: "policy-check", email: "", name: "", role, clientId: null, firmId: "default" };
    const permissions: Permission[] = ALL_MODULE_KEYS.flatMap((resource) => {
      const level = permissionService.accessLevel(user, resource);
      if (level === "—") return [];
      const action: PermissionAction = level === "F" ? "full" : level === "C" ? "create" : "view";
      return [{ resource, action }];
    });
    return { id: role, name: role, kind: "fixed", permissions };
  }
}

export const policyEvaluator: PolicyEvaluator = new LocalPolicyEvaluator();
