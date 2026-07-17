import { Role } from "@/generated/prisma/client";
import { PERMISSION_MATRIX, PERMISSION_ROLES, type AccessLevel } from "@/lib/constants/permission-matrix";
import type { ModuleKey } from "@/lib/constants/nav";
import type { PermissionCheck, PermissionService, UserContext } from "@/lib/platform/auth/types";

// permission-matrix.ts is keyed by row-per-module with a human-readable module label,
// not the same ModuleKey union nav.ts uses. This maps the subset that correspond
// 1:1 so `can()` can do a real lookup instead of just approximating from nav visibility.
const MODULE_KEY_TO_MATRIX_LABEL: Partial<Record<ModuleKey, string>> = {
  dashboard: "Dashboard",
  clients: "Clients / Companies / Contacts",
  companies: "Clients / Companies / Contacts",
  contacts: "Clients / Companies / Contacts",
  matters: "Matters / Court Cases",
  "court-cases": "Matters / Court Cases",
  hearings: "Hearings",
  tasks: "Tasks",
  calendar: "Calendar / Meetings",
  meetings: "Calendar / Meetings",
  notes: "Notes",
  documents: "Documents",
  "document-generator": "Document Generator",
  "template-library": "Template / Clause Library",
  "clause-library": "Template / Clause Library",
  "knowledge-base": "Knowledge Base / Research",
  research: "Knowledge Base / Research",
  billing: "Billing / Invoices / Payments",
  finance: "Finance",
  hr: "HR / Employees / Attendance / Leaves",
  attendance: "HR / Employees / Attendance / Leaves",
  leaves: "HR / Employees / Attendance / Leaves",
  reports: "Reports / Analytics",
  analytics: "Reports / Analytics",
  notifications: "Notifications",
  settings: "Settings / Firm Configuration",
  "audit-logs": "Audit Logs",
};

const ROLE_TO_MATRIX_COLUMN: Record<Role, number> = {
  [Role.MANAGING_PARTNER]: PERMISSION_ROLES.indexOf("Managing Partner"),
  [Role.SENIOR_PARTNER]: PERMISSION_ROLES.indexOf("Senior Partner"),
  [Role.PARTNER]: PERMISSION_ROLES.indexOf("Partner"),
  [Role.ASSOCIATE]: PERMISSION_ROLES.indexOf("Associate"),
  [Role.JUNIOR_ASSOCIATE]: PERMISSION_ROLES.indexOf("Jr. Associate"),
  [Role.LEGAL_RESEARCHER]: PERMISSION_ROLES.indexOf("Legal Researcher"),
  [Role.PARALEGAL]: PERMISSION_ROLES.indexOf("Paralegal"),
  [Role.RECEPTION]: PERMISSION_ROLES.indexOf("Reception"),
  [Role.ACCOUNTS]: PERMISSION_ROLES.indexOf("Accounts"),
  [Role.HR]: PERMISSION_ROLES.indexOf("HR"),
  [Role.OFFICE_MANAGER]: PERMISSION_ROLES.indexOf("Office Mgr"),
  [Role.ADMINISTRATOR]: PERMISSION_ROLES.indexOf("Administrator"),
  [Role.CLIENT]: -1, // Client Portal isn't a row in the staff permission matrix — it has its own separate, narrower shell.
};

const ACCESS_RANK: Record<AccessLevel, number> = { "—": 0, V: 1, C: 2, F: 3 };
const REQUIRED_RANK: Record<PermissionCheck["action"], number> = { view: 1, create: 2, full: 3 };

/**
 * Read-only facade over the existing `permission-matrix.ts` data (the same
 * F/C/V/— matrix already rendered in Settings). Doesn't add a new source of
 * truth — `nav.ts`'s per-role `ModuleKey[]` allow-lists remain the actual
 * gate for what renders; this is a typed way for future code (e.g. an API
 * layer that isn't a Server Component) to ask "can this user do X" without
 * re-deriving the matrix lookup by hand.
 */
export class LocalPermissionService implements PermissionService {
  accessLevel(user: UserContext, moduleKey: ModuleKey): AccessLevel {
    if (user.role === Role.CLIENT) return "—";
    const label = MODULE_KEY_TO_MATRIX_LABEL[moduleKey];
    const column = ROLE_TO_MATRIX_COLUMN[user.role];
    if (!label || column < 0) return "—";
    const row = PERMISSION_MATRIX.find((r) => r.module === label);
    return row?.access[column] ?? "—";
  }

  can(user: UserContext, check: PermissionCheck): boolean {
    const level = this.accessLevel(user, check.moduleKey);
    return ACCESS_RANK[level] >= REQUIRED_RANK[check.action];
  }
}

export const permissionService: PermissionService = new LocalPermissionService();
