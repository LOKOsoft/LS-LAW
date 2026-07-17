/**
 * Webhook readiness (Step 10) — interfaces only. No outbound webhook
 * delivery happens anywhere in this app. See docs/API_PREPARATION.md for
 * the real infrastructure (a `Webhook` Prisma model, signed delivery with
 * retries) this would need — deliberately not built without a real
 * subscriber to deliver to.
 */

export type WebhookEventType =
  | "matter.created"
  | "matter.stage_changed"
  | "document.filed"
  | "invoice.paid"
  | "generated_document.exported";

export type WebhookEvent = {
  type: WebhookEventType;
  tenantId: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
};

export type WebhookSubscription = {
  id: string;
  tenantId: string;
  url: string;
  /** HMAC secret used to sign delivered payloads — never logged or returned after creation in a real implementation. */
  secret: string;
  eventTypes: WebhookEventType[];
  active: boolean;
};

export interface WebhookDispatcher {
  dispatch(event: WebhookEvent): Promise<void>;
  subscribe(subscription: Omit<WebhookSubscription, "id">): Promise<WebhookSubscription>;
  unsubscribe(subscriptionId: string): Promise<void>;
}
