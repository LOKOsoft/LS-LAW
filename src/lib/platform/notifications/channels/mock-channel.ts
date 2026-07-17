import { logger } from "@/lib/platform/logging/logger";
import type { NotificationChannel, NotificationChannelType, NotificationMessage } from "@/lib/platform/notifications/types";

/** Console-only stand-in for a real email/SMS/WhatsApp/push/desktop provider. Never sends anything externally — logs what *would* have been sent, at debug level so it's silent unless someone's looking. */
export class MockChannel implements NotificationChannel {
  constructor(public readonly type: NotificationChannelType) {}

  async send(message: NotificationMessage): Promise<void> {
    logger.debug(`[mock ${this.type} channel] would send notification`, {
      channel: this.type,
      userIds: message.userIds,
      title: message.title,
    });
  }
}
