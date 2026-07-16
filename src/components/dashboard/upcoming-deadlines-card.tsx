import Link from "next/link";
import { AlarmClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PriorityPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeDate } from "@/lib/format";

type DeadlineTask = {
  id: string;
  title: string;
  priority: string;
  dueDate: Date | null;
  assignee: { name: string };
  matter: { title: string; matterNumber: string } | null;
};

export function UpcomingDeadlinesCard({
  tasks,
  basePath = "/managing-partner",
}: {
  tasks: DeadlineTask[];
  basePath?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming deadlines</CardTitle>
        <CardDescription>Open tasks due in the next 10 days</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <EmptyState icon={AlarmClock} title="No upcoming deadlines" description="You're all caught up for the next 10 days." />
        ) : (
          <div className="space-y-1">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`${basePath}/tasks`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {task.assignee.name}
                    {task.matter ? ` · ${task.matter.title}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <PriorityPill status={task.priority} />
                  <span className="text-xs text-muted-foreground">{task.dueDate ? formatRelativeDate(task.dueDate) : ""}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
