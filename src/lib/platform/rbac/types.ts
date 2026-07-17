/**
 * Explicit RBAC contract — a thin, dedicated naming layer over the same
 * data `lib/platform/auth/permission-service.ts` already reads (the real
 * `nav.ts` module allow-lists + `permission-matrix.ts`). Kept as its own
 * module because a future real RBAC system (per-tenant custom roles,
 * fine-grained resource permissions) is a distinct enough concept from
 * "the twelve fixed staff roles this app ships with" that it deserves its
 * own interface to grow into, rather than overloading `AuthProvider`.
 */

export type PermissionAction = "view" | "create" | "full";

export type Permission = {
  resource: string;
  action: PermissionAction;
};

export type RoleDefinition = {
  id: string;
  name: string;
  /** Fixed (one of the 13 seeded `Role` enum values) vs. a future per-tenant custom role. */
  kind: "fixed" | "custom";
  permissions: Permission[];
};

export interface PolicyEvaluator {
  can(roleId: string, permission: Permission): boolean;
  getRole(roleId: string): RoleDefinition | null;
}
