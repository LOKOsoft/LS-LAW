import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function MyTimeThisWeekCard({
  loggedHours,
  targetHours,
  pct,
}: {
  loggedHours: number;
  targetHours: number;
  pct: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My time this week</CardTitle>
        <CardDescription>Billable hours logged vs. your utilization target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {loggedHours}h <span className="text-sm font-normal text-muted-foreground">/ {targetHours}h target</span>
            </p>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">{pct}% of this week&apos;s target logged so far</p>
      </CardContent>
    </Card>
  );
}
