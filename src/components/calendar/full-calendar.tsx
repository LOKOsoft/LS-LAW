"use client";

import * as React from "react";
import { isSameDay } from "date-fns";
import { Gavel, Users, CheckSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime } from "@/lib/format";
import type { CalendarEvent } from "@/features/calendar/queries";

const iconByType = { hearing: Gavel, meeting: Users, task: CheckSquare };
const toneByType = {
  hearing: "bg-destructive/10 text-destructive",
  meeting: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  task: "bg-primary/10 text-primary",
};

export function FullCalendar({ events }: { events: CalendarEvent[] }) {
  const [selected, setSelected] = React.useState<Date>(new Date());

  const datesWithEvents = React.useMemo(() => events.map((e) => e.date), [events]);
  const dayEvents = React.useMemo(
    () => events.filter((e) => isSameDay(e.date, selected)).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [events, selected],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="w-fit">
        <CardContent>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => d && setSelected(d)}
            modifiers={{ hasEvent: datesWithEvents }}
            modifiersClassNames={{ hasEvent: "font-semibold underline decoration-primary decoration-2 underline-offset-4" }}
            className="p-0"
          />
          <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-destructive" /> Hearing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-sky-500" /> Meeting
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" /> Task due
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="pb-3 text-sm font-medium text-foreground">
            {selected.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          {dayEvents.length === 0 ? (
            <EmptyState icon={CheckSquare} title="Nothing scheduled" description="No hearings, meetings, or task deadlines on this day." />
          ) : (
            <div className="space-y-2">
              {dayEvents.map((event) => {
                const Icon = iconByType[event.type];
                return (
                  <div key={event.id} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${toneByType[event.type]}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{event.meta}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(event.date).split(", ")[1]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
