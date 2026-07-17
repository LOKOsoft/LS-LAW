import { PLAN_CATALOG } from "@/lib/platform/billing/plans";
import type { PaymentProvider, SaaSInvoice, Subscription } from "@/lib/platform/billing/types";

/** In-memory, non-persisted mock — every call succeeds instantly with fabricated data. Good enough to develop against the `PaymentProvider` interface before a real Stripe/Razorpay integration exists; not durable across restarts. */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock" as const;
  private readonly subscriptions = new Map<string, Subscription>();

  async createSubscription(tenantId: string, planId: string): Promise<Subscription> {
    const plan = PLAN_CATALOG.find((p) => p.id === planId);
    if (!plan) throw new Error(`Unknown plan "${planId}"`);

    const subscription: Subscription = {
      id: `mock-sub-${tenantId}-${Date.now()}`,
      tenantId,
      planId,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      seatsUsed: 1,
    };
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) subscription.status = "canceled";
  }

  async listInvoices(subscriptionId: string): Promise<SaaSInvoice[]> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return [];
    return [
      {
        id: `mock-inv-${subscriptionId}-1`,
        subscriptionId,
        amountMinorUnits: 0,
        currency: "USD",
        issuedAt: new Date(),
        paidAt: new Date(),
        pdfUrl: null,
      },
    ];
  }
}
