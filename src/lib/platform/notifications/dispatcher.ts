import { appConfig } from "@/lib/platform/config";
import { InAppChannel } from "@/lib/platform/notifications/channels/in-app-channel";
import { MockChannel } from "@/lib/platform/notifications/channels/mock-channel";
import type { NotificationChannel, NotificationChannelType, NotificationMessage } from "@/lib/platform/notifications/types";

const ALL_CHANNEL_TYPES: NotificationChannelType[] = ["in-app", "email", "sms", "whatsapp", "push", "desktop"];

function buildChannel(type: NotificationChannelType): NotificationChannel {
  return type === "in-app" ? new InAppChannel() : new MockChannel(type);
}

/**
 * Fans a notification out to every channel enabled in `appConfig.notificationChannels`
 * (default: just "in-app", which is real). Enabling e.g. "email" in config today
 * routes through `MockChannel` — it logs, it never emails anyone, until a real
 * provider adapter replaces `MockChannel` for that type.
 */
export async function dispatchNotification(message: NotificationMessage): Promise<void> {
  const enabled = new Set(appConfig.notificationChannels.filter((c): c is NotificationChannelType => ALL_CHANNEL_TYPES.includes(c as NotificationChannelType)));
  if (enabled.size === 0) enabled.add("in-app");

  await Promise.all(Array.from(enabled).map((type) => buildChannel(type).send(message)));
}
