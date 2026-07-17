import { logger } from "@/lib/platform/logging/logger";
import type { WebhookDispatcher, WebhookEvent, WebhookSubscription } from "@/lib/platform/webhooks/types";
import { ProviderNotConfiguredError } from "@/lib/platform/errors/domain-errors";

/** Logs what would have been delivered — never makes a real HTTP call to any subscriber URL. No `WebhookSubscription` can actually be created (`subscribe()` throws) since there's no persistence for it yet. */
export class MockWebhookDispatcher implements WebhookDispatcher {
  async dispatch(event: WebhookEvent): Promise<void> {
    logger.debug("webhook_dispatch_mock", { type: event.type, tenantId: event.tenantId });
  }

  async subscribe(): Promise<WebhookSubscription> {
    throw new ProviderNotConfiguredError("Webhooks", "mock");
  }

  async unsubscribe(): Promise<void> {
    throw new ProviderNotConfiguredError("Webhooks", "mock");
  }
}

export const webhookDispatcher: WebhookDispatcher = new MockWebhookDispatcher();
