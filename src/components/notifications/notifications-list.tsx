"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { markNotificationRead, markAllNotificationsRead } from "@/features/notifications/actions";
import { formatTimeAgo } from "@/lib/format";
import type { NotificationItem } from "@/features/notifications/queries";

export function NotificationsList({
  notifications,
  basePath = "/managing-partner",
}: {
  notifications: NotificationItem[];
  basePath?: string;
}) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-3">
      {unread > 0 ? (
        <div className="flex justify-end">
          <form action={markAllNotificationsRead}>
            <button type="submit" className="text-sm font-medium text-primary hover:underline">
              Mark all {unread} as read
            </button>
          </form>
        </div>
      ) : null}
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="You're all caught up." />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <form action={markNotificationRead.bind(null, n.id)} className="flex min-w-0 flex-1 items-start gap-3">
                  <button type="submit" className="mt-1.5 shrink-0">
                    <span className={`block size-2 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm leading-snug ${n.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                      {n.title}
                    </p>
                    {n.body ? <p className="text-xs text-muted-foreground">{n.body}</p> : null}
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatTimeAgo(n.createdAt)}</p>
                  </div>
                </form>
                {n.matter ? (
                  <Link
                    href={`${basePath}/matters/${n.matter.id}`}
                    className="shrink-0 text-xs font-medium text-primary hover:underline"
                  >
                    View matter
                  </Link>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
