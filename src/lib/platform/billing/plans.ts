import type { Plan } from "@/lib/platform/billing/types";

/** Placeholder plan catalog — not persisted, not billed against. Real plan data would live in the DB once billing is real (a `Plan`/`Subscription` model pair, distinct from the firm's own `Invoice` model). */
export const PLAN_CATALOG: Plan[] = [
  { id: "plan-free", tier: "free", name: "Free (local/self-hosted)", priceMonthlyMinorUnits: 0, currency: "USD", seatLimit: 5, features: [] },
  {
    id: "plan-starter",
    tier: "starter",
    name: "Starter",
    priceMonthlyMinorUnits: 4900,
    currency: "USD",
    seatLimit: 15,
    features: ["external-notifications"],
  },
  {
    id: "plan-professional",
    tier: "professional",
    name: "Professional",
    priceMonthlyMinorUnits: 14900,
    currency: "USD",
    seatLimit: 50,
    features: ["external-notifications", "ai-assistant", "advanced-reports"],
  },
  {
    id: "plan-enterprise",
    tier: "enterprise",
    name: "Enterprise",
    priceMonthlyMinorUnits: 0, // custom/quoted
    currency: "USD",
    seatLimit: null,
    features: ["external-notifications", "ai-assistant", "advanced-reports", "cloud-storage", "multi-tenant-admin", "audit-log-export"],
  },
];
