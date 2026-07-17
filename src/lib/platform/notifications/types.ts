export type NotificationChannelType = "in-app" | "email" | "sms" | "whatsapp" | "push" | "desktop";

export type NotificationMessage = {
  userIds: string[];
  title: string;
  body?: string;
  /** Optional deep-link context, e.g. a matter a notification relates to. */
  matterId?: string | null;
};

export interface NotificationChannel {
  readonly type: NotificationChannelType;
  send(message: NotificationMessage): Promise<void>;
}
