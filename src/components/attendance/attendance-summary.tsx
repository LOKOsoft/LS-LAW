import { Card, CardContent } from "@/components/ui/card";

export function AttendanceSummary({
  summary,
}: {
  summary: { totalStaff: number; present: number; absent: number; onLeave: number; notMarked: number };
}) {
  const stats = [
    { label: "Total staff", value: summary.totalStaff },
    { label: "Present today", value: summary.present },
    { label: "Absent", value: summary.absent },
    { label: "On leave", value: summary.onLeave },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="py-4">
          <CardContent className="px-4">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
