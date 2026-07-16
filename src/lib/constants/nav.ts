import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  Gavel,
  CheckSquare,
  FolderOpen,
  FilePlus2,
  LayoutTemplate,
  BookMarked,
  Receipt,
  Wallet,
  UserCog,
  BarChart3,
  BookOpen,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const MANAGING_PARTNER_BASE = "/managing-partner";

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: `${MANAGING_PARTNER_BASE}`, icon: LayoutDashboard, description: "Firm-wide executive overview" },
    ],
  },
  {
    label: "Practice",
    items: [
      { label: "Clients", href: `${MANAGING_PARTNER_BASE}/clients`, icon: Users, description: "Client relationships & CRM" },
      { label: "Matters", href: `${MANAGING_PARTNER_BASE}/matters`, icon: Briefcase, description: "Active and closed matters" },
      { label: "Calendar", href: `${MANAGING_PARTNER_BASE}/calendar`, icon: CalendarDays, description: "Firm-wide schedule" },
      { label: "Hearings", href: `${MANAGING_PARTNER_BASE}/hearings`, icon: Gavel, description: "Court dates & hearing tracker" },
      { label: "Tasks", href: `${MANAGING_PARTNER_BASE}/tasks`, icon: CheckSquare, description: "Team task board" },
    ],
  },
  {
    label: "Documents",
    items: [
      { label: "Documents", href: `${MANAGING_PARTNER_BASE}/documents`, icon: FolderOpen, description: "Document vault" },
      { label: "Document Generator", href: `${MANAGING_PARTNER_BASE}/document-generator`, icon: FilePlus2, description: "Generate from templates" },
      { label: "Template Library", href: `${MANAGING_PARTNER_BASE}/template-library`, icon: LayoutTemplate, description: "Reusable document templates" },
      { label: "Clause Library", href: `${MANAGING_PARTNER_BASE}/clause-library`, icon: BookMarked, description: "Approved clause bank" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Billing", href: `${MANAGING_PARTNER_BASE}/billing`, icon: Receipt, description: "Invoices, payments & retainers" },
      { label: "Finance", href: `${MANAGING_PARTNER_BASE}/finance`, icon: Wallet, description: "Firm financial overview" },
    ],
  },
  {
    label: "Firm",
    items: [
      { label: "HR", href: `${MANAGING_PARTNER_BASE}/hr`, icon: UserCog, description: "Team & people operations" },
      { label: "Reports", href: `${MANAGING_PARTNER_BASE}/reports`, icon: BarChart3, description: "Executive analytics" },
      { label: "Knowledge Base", href: `${MANAGING_PARTNER_BASE}/knowledge-base`, icon: BookOpen, description: "Internal know-how" },
      { label: "Settings", href: `${MANAGING_PARTNER_BASE}/settings`, icon: Settings, description: "Firm configuration" },
    ],
  },
];

export const roleRoutes: { label: string; href: string }[] = [
  { label: "Managing Partner", href: "/managing-partner" },
  { label: "Senior Partner", href: "/senior-partner" },
  { label: "Associate", href: "/associate" },
  { label: "Paralegal", href: "/paralegal" },
  { label: "Reception", href: "/reception" },
  { label: "Accounts", href: "/accounts" },
  { label: "HR", href: "/hr" },
  { label: "Client", href: "/client" },
];
