import { Gavel, Users, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { formatTime } from "@/lib/format";

type ScheduleItem = {
  id: string;
  type: "hearing" | "meeting" | "task";
  time: Date;
  title: string;
  meta: string;
};

const iconByType = { hearing: Gavel, meeting: Users, task: CheckSquare };
const toneByType = {
  hearing: "bg-destructive/10 text-destructive",
  meeting: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  task: "bg-primary/10 text-primary",
};

export function TodaysScheduleCard({ items }: { items: ScheduleItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s schedule</CardTitle>
        <CardDescription>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={new Date()}
          className="w-full rounded-lg border border-border p-2 [--cell-size:2.1rem]"
        />
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nothing scheduled for today.</p>
          ) : (
            items.map((item) => {
              const Icon = iconByType[item.type];
              return (
                <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${toneByType[item.type]}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">{formatTime(item.time)}</span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
