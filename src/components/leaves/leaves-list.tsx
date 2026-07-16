"use client";

import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPill, type StatusTone } from "@/components/shared/status-pill";
import { formatDate, initials } from "@/lib/format";
import { decideLeaveRequest } from "@/features/leaves/actions";
import type { LeaveRequestItem } from "@/features/leaves/queries";

const LEAVE_TONE: Record<string, StatusTone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

export function LeavesList({ requests }: { requests: LeaveRequestItem[] }) {
  if (requests.length === 0) {
    return <EmptyState icon={CalendarClock} title="No leave requests" description="Employee leave requests will appear here." />;
  }

  return (
    <div className="space-y-2">
      {requests.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(r.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{r.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {r.type.charAt(0) + r.type.slice(1).toLowerCase()} leave · {formatDate(r.startDate)} – {formatDate(r.endDate)} ({r.days}d)
                </p>
                {r.reason ? <p className="truncate text-xs text-muted-foreground">{r.reason}</p> : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {r.status === "PENDING" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decideLeaveRequest(r.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => decideLeaveRequest(r.id, "APPROVED")}>
                    Approve
                  </Button>
                </>
              ) : (
                <StatusPill label={r.status} tone={LEAVE_TONE[r.status] ?? "neutral"} />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
