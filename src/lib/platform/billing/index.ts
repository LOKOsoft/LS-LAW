export type {
  Plan,
  PlanTier,
  Subscription,
  SubscriptionStatus,
  SaaSInvoice,
  FeatureKey,
  FeatureGate,
  License,
  PaymentProvider,
} from "@/lib/platform/billing/types";
export { PLAN_CATALOG } from "@/lib/platform/billing/plans";
export { MockPaymentProvider } from "@/lib/platform/billing/mock-payment-provider";
export { LocalFeatureGate, featureGate } from "@/lib/platform/billing/feature-gate";

import { appConfig } from "@/lib/platform/config";
import { MockPaymentProvider } from "@/lib/platform/billing/mock-payment-provider";
import type { PaymentProvider } from "@/lib/platform/billing/types";

/** Resolves the active payment provider from config — always mock until a real Stripe/Razorpay adapter is written and `LEXORA_PAYMENT_PROVIDER` is set. */
export function getPaymentProvider(): PaymentProvider {
  if (appConfig.providers.payment !== "mock") {
    throw new Error(
      `Payment provider "${appConfig.providers.payment}" has no real implementation yet — only "mock" is available.`,
    );
  }
  return new MockPaymentProvider();
}
