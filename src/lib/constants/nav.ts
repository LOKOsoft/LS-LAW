import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Contact,
  Briefcase,
  Landmark,
  CalendarDays,
  Gavel,
  CheckSquare,
  Users2,
  StickyNote,
  FolderOpen,
  FilePlus2,
  LayoutTemplate,
  BookMarked,
  BookOpen,
  Search,
  Receipt,
  Wallet,
  UserCog,
  CalendarCheck,
  CalendarClock,
  BarChart3,
  LineChart,
  Bell,
  Settings,
  ShieldCheck,
} from "lucide-react";

export type ModuleKey =
  | "dashboard"
  | "clients"
  | "companies"
  | "contacts"
  | "matters"
  | "court-cases"
  | "calendar"
  | "hearings"
  | "tasks"
  | "meetings"
  | "notes"
  | "documents"
  | "document-generator"
  | "template-library"
  | "clause-library"
  | "knowledge-base"
  | "research"
  | "billing"
  | "finance"
  | "hr"
  | "attendance"
  | "leaves"
  | "reports"
  | "analytics"
  | "notifications"
  | "settings"
  | "audit-logs";

export type NavItem = {
  key: ModuleKey;
  label: string;
  path: string; // relative to a role's base path; "" means the base path itself
  icon: LucideIcon;
  description: string;
};

export type NavSectionDef = {
  label: string;
  items: NavItem[];
};

const NAV_STRUCTURE: NavSectionDef[] = [
  {
    label: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", path: "", icon: LayoutDashboard, description: "Role-aware home overview" },
    ],
  },
  {
    label: "CRM",
    items: [
      { key: "clients", label: "Clients", path: "clients", icon: Users, description: "Client relationships & CRM" },
      { key: "companies", label: "Companies", path: "companies", icon: Building2, description: "Corporate client organizations" },
      { key: "contacts", label: "Contacts", path: "contacts", icon: Contact, description: "People at client organizations" },
    ],
  },
  {
    label: "Practice",
    items: [
      { key: "matters", label: "Matters", path: "matters", icon: Briefcase, description: "Active and closed matters" },
      { key: "court-cases", label: "Court Cases", path: "court-cases", icon: Landmark, description: "Litigation case tracker" },
      { key: "hearings", label: "Hearings", path: "hearings", icon: Gavel, description: "Court dates & hearing tracker" },
      { key: "tasks", label: "Tasks", path: "tasks", icon: CheckSquare, description: "Team task board" },
      { key: "calendar", label: "Calendar", path: "calendar", icon: CalendarDays, description: "Firm-wide schedule" },
      { key: "meetings", label: "Meetings", path: "meetings", icon: Users2, description: "Client & internal meetings" },
      { key: "notes", label: "Notes", path: "notes", icon: StickyNote, description: "Internal notes across matters & clients" },
    ],
  },
  {
    label: "Documents & Knowledge",
    items: [
      { key: "documents", label: "Documents", path: "documents", icon: FolderOpen, description: "Document vault" },
      { key: "document-generator", label: "Document Generator", path: "document-generator", icon: FilePlus2, description: "Generate from templates" },
      { key: "template-library", label: "Template Library", path: "template-library", icon: LayoutTemplate, description: "Reusable document templates" },
      { key: "clause-library", label: "Clause Library", path: "clause-library", icon: BookMarked, description: "Approved clause bank" },
      { key: "knowledge-base", label: "Knowledge Base", path: "knowledge-base", icon: BookOpen, description: "Internal know-how" },
      { key: "research", label: "Research", path: "research", icon: Search, description: "Legal research references" },
    ],
  },
  {
    label: "Finance",
    items: [
      { key: "billing", label: "Billing", path: "billing", icon: Receipt, description: "Invoices, payments & retainers" },
      { key: "finance", label: "Finance", path: "finance", icon: Wallet, description: "Firm financial overview" },
    ],
  },
  {
    label: "People",
    items: [
      { key: "hr", label: "HR", path: "hr", icon: UserCog, description: "Team & people operations" },
      { key: "attendance", label: "Attendance", path: "attendance", icon: CalendarCheck, description: "Daily attendance tracking" },
      { key: "leaves", label: "Leaves", path: "leaves", icon: CalendarClock, description: "Leave requests & approvals" },
    ],
  },
  {
    label: "Insights",
    items: [
      { key: "reports", label: "Reports", path: "reports", icon: BarChart3, description: "Executive analytics" },
      { key: "analytics", label: "Analytics", path: "analytics", icon: LineChart, description: "Custom analytics views" },
    ],
  },
  {
    label: "System",
    items: [
      { key: "notifications", label: "Notifications", path: "notifications", icon: Bell, description: "Firm-relevant alerts" },
      { key: "settings", label: "Settings", path: "settings", icon: Settings, description: "Firm configuration" },
      { key: "audit-logs", label: "Audit Logs", path: "audit-logs", icon: ShieldCheck, description: "Compliance activity trail" },
    ],
  },
];

export const ALL_MODULE_KEYS: ModuleKey[] = NAV_STRUCTURE.flatMap((s) => s.items.map((i) => i.key));

export const SENIOR_PARTNER_MODULE_KEYS: ModuleKey[] = ALL_MODULE_KEYS.filter(
  (key) => !["hr", "attendance", "leaves", "reports", "analytics", "settings", "audit-logs"].includes(key),
);

export type ResolvedNavItem = { label: string; href: string; icon: LucideIcon; description: string };
export type ResolvedNavSection = { label: string; items: ResolvedNavItem[] };

export function buildNavSections(basePath: string, allowedKeys: ModuleKey[]): ResolvedNavSection[] {
  const allowed = new Set(allowedKeys);
  return NAV_STRUCTURE.map((section) => ({
    label: section.label,
    items: section.items
      .filter((item) => allowed.has(item.key))
      .map((item) => ({
        label: item.label,
        href: item.path ? `${basePath}/${item.path}` : basePath,
        icon: item.icon,
        description: item.description,
      })),
  })).filter((section) => section.items.length > 0);
}

export const MANAGING_PARTNER_BASE = "/managing-partner";
export const SENIOR_PARTNER_BASE = "/senior-partner";
export const PARTNER_BASE = "/partner";
export const ASSOCIATE_BASE = "/associate";
export const JUNIOR_ASSOCIATE_BASE = "/junior-associate";
export const LEGAL_RESEARCHER_BASE = "/legal-researcher";
export const PARALEGAL_BASE = "/paralegal";
export const RECEPTION_BASE = "/reception";
export const ACCOUNTS_BASE = "/accounts";
export const HR_BASE = "/hr";
export const OFFICE_MANAGER_BASE = "/office-manager";
export const ADMINISTRATOR_BASE = "/administrator";

// Partner mirrors Senior Partner's access exactly (same matrix row).
export const PARTNER_MODULE_KEYS: ModuleKey[] = SENIOR_PARTNER_MODULE_KEYS;
// Associate mirrors Senior Partner too (billing access is time-entry scoped, not nav-gated further).
export const ASSOCIATE_MODULE_KEYS: ModuleKey[] = SENIOR_PARTNER_MODULE_KEYS;
// Junior Associate & Paralegal: same as Senior Partner minus firm-wide Finance visibility.
export const JUNIOR_ASSOCIATE_MODULE_KEYS: ModuleKey[] = SENIOR_PARTNER_MODULE_KEYS.filter((k) => k !== "finance");
export const PARALEGAL_MODULE_KEYS: ModuleKey[] = SENIOR_PARTNER_MODULE_KEYS.filter((k) => k !== "finance");
// Legal Researcher: research-focused, no hearings/billing/finance.
export const LEGAL_RESEARCHER_MODULE_KEYS: ModuleKey[] = SENIOR_PARTNER_MODULE_KEYS.filter(
  (k) => !["hearings", "billing", "finance"].includes(k),
);
// Reception: front-desk — client intake & scheduling only.
export const RECEPTION_MODULE_KEYS: ModuleKey[] = ["dashboard", "clients", "calendar", "notifications"];
// Accounts: firm-wide finance operations.
export const ACCOUNTS_MODULE_KEYS: ModuleKey[] = [
  "dashboard", "clients", "matters", "calendar", "documents", "billing", "finance", "reports", "notifications",
];
// HR: people operations only.
export const HR_MODULE_KEYS: ModuleKey[] = ["dashboard", "hr", "attendance", "leaves", "reports", "notifications"];
// Office Manager: operations — scheduling, expenses, HR oversight, firm configuration.
export const OFFICE_MANAGER_MODULE_KEYS: ModuleKey[] = ["dashboard", "calendar", "billing", "hr", "reports", "notifications", "settings"];
// Administrator: full system visibility + full Settings/Audit Logs control.
export const ADMINISTRATOR_MODULE_KEYS: ModuleKey[] = ALL_MODULE_KEYS;

export const navSections: ResolvedNavSection[] = buildNavSections(MANAGING_PARTNER_BASE, ALL_MODULE_KEYS);

export const roleRoutes: { label: string; href: string }[] = [
  { label: "Managing Partner", href: "/managing-partner" },
  { label: "Senior Partner", href: "/senior-partner" },
  { label: "Partner", href: "/partner" },
  { label: "Associate", href: "/associate" },
  { label: "Junior Associate", href: "/junior-associate" },
  { label: "Legal Researcher", href: "/legal-researcher" },
  { label: "Paralegal", href: "/paralegal" },
  { label: "Reception", href: "/reception" },
  { label: "Accounts", href: "/accounts" },
  { label: "HR", href: "/hr" },
  { label: "Office Manager", href: "/office-manager" },
  { label: "Administrator", href: "/administrator" },
  { label: "Client", href: "/client" },
];
