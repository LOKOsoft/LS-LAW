import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timeline } from "@/components/shared/timeline";
import type { RecentActivityItem } from "@/features/activity/queries";

export function RecentActivityCard({
  items,
  description = "Latest actions across the firm",
}: {
  items: RecentActivityItem[];
  description?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Timeline
          items={items.map((item) => ({
            id: item.id,
            actorName: item.actor.name,
            timestamp: item.createdAt,
            content: (
              <>
                <span className="font-medium text-foreground">{item.actor.name}</span>{" "}
                <span className="text-muted-foreground">{item.action}</span>{" "}
                <span className="font-medium text-foreground">{item.matter?.title ?? item.client?.name ?? ""}</span>
              </>
            ),
          }))}
          emptyIcon={Activity}
          emptyTitle="No activity yet"
          emptyDescription="Activity will show up here as your team works."
        />
      </CardContent>
    </Card>
  );
}
