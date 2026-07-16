import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const barTone: Record<string, string> = {
  "To Do": "bg-muted-foreground/40",
  "In Progress": "bg-sky-500",
  "In Review": "bg-warning",
  Done: "bg-success",
};

export function TaskOverviewCard({ data }: { data: { status: string; count: number }[] }) {
  const total = Math.max(1, data.reduce((sum, d) => sum + d.count, 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task overview</CardTitle>
        <CardDescription>Firm-wide task board status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((d) => (
          <div key={d.status} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{d.status}</span>
              <span className="font-medium tabular-nums text-foreground">{d.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all", barTone[d.status])}
                style={{ width: `${(d.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
