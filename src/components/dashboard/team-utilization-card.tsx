import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TeamUtilizationCard({ data }: { data: { name: string; pct: number; target: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team utilization</CardTitle>
        <CardDescription>Billable hours logged this month vs target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((u) => {
          const meetsTarget = u.pct >= u.target;
          return (
            <div key={u.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-foreground">{u.name}</span>
                <span className={cn("font-medium tabular-nums", meetsTarget ? "text-success" : "text-muted-foreground")}>
                  {u.pct}%
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", meetsTarget ? "bg-success" : "bg-primary")}
                  style={{ width: `${Math.min(100, u.pct)}%` }}
                />
                <div className="absolute top-0 h-full w-px bg-foreground/30" style={{ left: `${Math.min(100, u.target)}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
