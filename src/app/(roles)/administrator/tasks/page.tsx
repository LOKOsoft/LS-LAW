import { PageHeader } from "@/components/shared/page-header";
import { TasksBoard } from "@/components/tasks/tasks-board";
import { NewTaskForm } from "@/components/tasks/new-task-form";
import { getTasks, getTaskFormOptions } from "@/features/tasks/queries";

export default async function TasksPage() {
  const [tasks, options] = await Promise.all([getTasks(), getTaskFormOptions()]);

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Firm-wide task board across matters and team members."
        actions={<NewTaskForm assignees={options.assignees} matters={options.matters} />}
      />
      <TasksBoard tasks={tasks} assignees={options.assignees} />
    </div>
  );
}
