import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { formatTimeAgo, initials } from "@/lib/format";
import type { RecentActivityItem } from "@/features/activity/queries";

export function RecentActivityCard({ items }: { items: RecentActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest actions across the firm</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Activity will show up here as your team works." />
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-[11px]">{initials(item.actor.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm leading-snug">
                    <span className="font-medium text-foreground">{item.actor.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <span className="font-medium text-foreground">{item.matter?.title ?? item.client?.name ?? ""}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
