import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { formatTimeAgo, initials } from "@/lib/format";

export type TimelineItem = {
  id: string;
  actorName: string;
  content: React.ReactNode;
  timestamp: Date | string;
};

type TimelineProps = {
  items: TimelineItem[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
};

/** Actor avatar + content + relative timestamp feed — the pattern shared by activity, notes, and audit-style views. */
export function Timeline({ items, emptyIcon, emptyTitle, emptyDescription }: TimelineProps) {
  if (items.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-[11px]">{initials(item.actorName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm leading-snug">{item.content}</p>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
