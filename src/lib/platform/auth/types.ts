import type { Role } from "@/generated/prisma/client";
import type { ModuleKey } from "@/lib/constants/nav";
import type { AccessLevel } from "@/lib/constants/permission-matrix";

/** Shape of "the logged-in user" that any future auth provider (NextAuth, Clerk, WorkOS, a custom multi-tenant IdP) would need to produce. Matches the real `User` fields `requireUser()` already returns. */
export interface UserContext {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Non-null only for Client Portal logins. */
  clientId: string | null;
  /** Reserved for multi-tenancy — resolves to the single seeded Firm today. See `@/lib/platform/tenancy`. */
  firmId: string;
}

export interface SessionContext {
  id: string;
  userId: string;
  expiresAt: Date;
}

/**
 * `ModuleKey` is nav-routed modules only (it backs `buildNavSections`). The
 * permission matrix has a few rows — "AI Assistant" — with no corresponding
 * navigable route, so permission checks accept this wider key without
 * stretching `ModuleKey`'s meaning.
 */
export type PermissionModuleKey = ModuleKey | "matter-assistant";

export interface PermissionCheck {
  moduleKey: PermissionModuleKey;
  /** "view" maps to the matrix's V/C/F tiers all being sufficient; "create" requires C or F; "full" requires F. */
  action: "view" | "create" | "full";
}

/** What a pluggable auth provider must expose. `LocalAuthProvider` is the only implementation — it delegates to the real session/DAL code and never replaces it. */
export interface AuthProvider {
  getCurrentUser(): Promise<UserContext | null>;
  getSession(): Promise<SessionContext | null>;
}

/** What a pluggable permission/authorization service must expose. */
export interface PermissionService {
  can(user: UserContext, check: PermissionCheck): boolean;
  accessLevel(user: UserContext, moduleKey: PermissionModuleKey): AccessLevel;
}

export type { Role, ModuleKey, AccessLevel };
