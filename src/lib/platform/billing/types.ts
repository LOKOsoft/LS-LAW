/**
 * SaaS subscription/billing for the LEXORA *product itself* (what a firm
 * would pay LEXORA to use it as a hosted service). Entirely separate from
 * `src/features/billing/*`, which is the firm's own client invoicing module
 * — that's real, working, and unrelated to this.
 */

export type PlanTier = "free" | "starter" | "professional" | "enterprise";

export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  priceMonthlyMinorUnits: number;
  currency: string;
  seatLimit: number | null;
  features: FeatureKey[];
}

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  seatsUsed: number;
}

export interface SaaSInvoice {
  id: string;
  subscriptionId: string;
  amountMinorUnits: number;
  currency: string;
  issuedAt: Date;
  paidAt: Date | null;
  pdfUrl: string | null;
}

/** Feature keys gated by plan — checked via `FeatureGate`, not scattered `if (plan === ...)` checks at call sites. */
export type FeatureKey =
  | "ai-assistant"
  | "cloud-storage"
  | "external-notifications"
  | "multi-tenant-admin"
  | "advanced-reports"
  | "audit-log-export";

export interface FeatureGate {
  isEnabled(tenantId: string, feature: FeatureKey): Promise<boolean>;
}

export interface License {
  tenantId: string;
  planId: string;
  seatLimit: number | null;
  expiresAt: Date | null;
}

/** What a real payment processor integration must implement. No real provider exists yet — `MockPaymentProvider` is the only implementation. */
export interface PaymentProvider {
  readonly name: "mock" | "stripe" | "razorpay";
  createSubscription(tenantId: string, planId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  listInvoices(subscriptionId: string): Promise<SaaSInvoice[]>;
}
