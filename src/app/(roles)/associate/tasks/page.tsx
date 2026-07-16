import { PageHeader } from "@/components/shared/page-header";
import { TasksBoard } from "@/components/tasks/tasks-board";
import { NewTaskForm } from "@/components/tasks/new-task-form";
import { getTasks, getTaskFormOptions } from "@/features/tasks/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function AssociateTasksPage() {
  const user = await requireUser(Role.ASSOCIATE);
  const [tasks, options] = await Promise.all([
    getTasks({ scopeUserId: user.id }),
    getTaskFormOptions({ scopeUserId: user.id }),
  ]);

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Tasks assigned to you, created by you, or on your matters."
        actions={<NewTaskForm assignees={options.assignees} matters={options.matters} />}
      />
      <TasksBoard tasks={tasks} assignees={options.assignees} />
    </div>
  );
}
