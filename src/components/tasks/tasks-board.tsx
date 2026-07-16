"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckSquare } from "lucide-react";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityPill } from "@/components/shared/status-pill";
import { formatDate } from "@/lib/format";
import { updateTaskStatus } from "@/features/tasks/actions";
import type { TaskListItem } from "@/features/tasks/queries";

const columns: { status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "IN_REVIEW", label: "In Review" },
  { status: "DONE", label: "Done" },
];

export function TasksBoard({ tasks, assignees }: { tasks: TaskListItem[]; assignees: { id: string; name: string }[] }) {
  const [search, setSearch] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState("ALL");
  const router = useRouter();

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = search.trim().length === 0 || t.title.toLowerCase().includes(search.toLowerCase());
      const matchesAssignee = assigneeId === "ALL" || t.assignee.id === assigneeId;
      return matchesSearch && matchesAssignee;
    });
  }, [tasks, search, assigneeId]);

  async function handleMove(taskId: string, status: (typeof columns)[number]["status"]) {
    try {
      await updateTaskStatus(taskId, status);
      router.refresh();
    } catch {
      toast.error("Could not update task");
    }
  }

  if (tasks.length === 0) {
    return <EmptyState icon={CheckSquare} title="No tasks yet" description="Tasks assigned to the team will appear here." />;
  }

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tasks by title..."
        filters={
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All assignees</SelectItem>
              {assignees.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-medium text-foreground">{col.label}</p>
                <span className="text-xs text-muted-foreground">{colTasks.length}</span>
              </div>
              <div className="max-h-[calc(100vh-20rem)] space-y-2 overflow-y-auto pr-1">
                {colTasks.map((task) => (
                  <Card key={task.id} className="gap-2 py-3">
                    <CardContent className="space-y-2 px-3">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{task.matter?.title ?? "Firm-wide"}</p>
                      <div className="flex items-center justify-between">
                        <PriorityPill status={task.priority} />
                        {task.dueDate ? <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span> : null}
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 pt-2">
                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                        <Select value={task.status} onValueChange={(v) => handleMove(task.id, v as (typeof columns)[number]["status"])}>
                          <SelectTrigger size="sm" className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {columns.map((c) => (
                              <SelectItem key={c.status} value={c.status} className="text-xs">
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {colTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                    No tasks
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
