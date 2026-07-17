export type { AuthProvider, PermissionService, PermissionCheck, UserContext, SessionContext } from "@/lib/platform/auth/types";
export { LocalAuthProvider } from "@/lib/platform/auth/local-auth-provider";
export { localAuthProvider as authProvider } from "@/lib/platform/auth/local-provider-instance";
export { LocalPermissionService, permissionService } from "@/lib/platform/auth/permission-service";
export { requireCurrentUser, assertPermission, withPermission } from "@/lib/platform/auth/guards";
