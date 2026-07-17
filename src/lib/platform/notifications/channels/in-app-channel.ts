import { notifyUsers } from "@/lib/services/notifications";
import type { NotificationChannel, NotificationMessage } from "@/lib/platform/notifications/types";
import type { NotificationType } from "@/generated/prisma/client";

/** Wraps the real, working in-app notification writer — behavior is unchanged from calling `notifyUsers` directly. */
export class InAppChannel implements NotificationChannel {
  readonly type = "in-app" as const;

  async send(message: NotificationMessage & { type?: NotificationType }): Promise<void> {
    await notifyUsers({
      userIds: message.userIds,
      type: message.type ?? "SYSTEM",
      title: message.title,
      body: message.body,
      matterId: message.matterId,
    });
  }
}
