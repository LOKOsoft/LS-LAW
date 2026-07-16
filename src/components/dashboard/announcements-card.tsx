import { Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusPill, type StatusTone } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/format";

type AnnouncementItem = { id: string; title: string; body: string; priority: string; publishedAt: Date };

const priorityTone: Record<string, StatusTone> = {
  NORMAL: "neutral",
  IMPORTANT: "warning",
  URGENT: "destructive",
};

export function AnnouncementsCard({ items }: { items: AnnouncementItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Firm-wide notices</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Megaphone} title="No announcements" />
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <div key={a.id} className="space-y-1 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <StatusPill label={a.priority.charAt(0) + a.priority.slice(1).toLowerCase()} tone={priorityTone[a.priority]} />
                </div>
                <p className="text-sm text-muted-foreground">{a.body}</p>
                <p className="text-xs text-muted-foreground">{formatDate(a.publishedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
