import { Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPill, type StatusTone } from "@/components/shared/status-pill";
import { formatDateTime } from "@/lib/format";
import type { MeetingListItem } from "@/features/meetings/queries";

const MEETING_TONE: Record<string, StatusTone> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export function MeetingsList({ meetings }: { meetings: MeetingListItem[] }) {
  if (meetings.length === 0) {
    return <EmptyState icon={Users2} title="No meetings scheduled" description="Client and internal meetings will appear here." />;
  }

  return (
    <div className="space-y-2">
      {meetings.map((m) => (
        <Card key={m.id}>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{m.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {m.client?.name ?? m.matter?.title ?? "Internal"} · {m.location ?? "No location set"} · {m.durationMinutes} min
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusPill label={m.status} tone={MEETING_TONE[m.status] ?? "neutral"} />
              <span className="text-xs text-muted-foreground">{formatDateTime(m.scheduledAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
