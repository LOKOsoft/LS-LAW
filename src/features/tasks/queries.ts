import { prisma } from "@/lib/db/prisma";

export async function getTasks() {
  return prisma.task.findMany({
    orderBy: { dueDate: "asc" },
    include: {
      assignee: { select: { id: true, name: true } },
      matter: { select: { id: true, title: true, matterNumber: true } },
    },
  });
}
export type TaskListItem = Awaited<ReturnType<typeof getTasks>>[number];

export async function getTaskFormOptions() {
  const [assignees, matters] = await Promise.all([
    prisma.user.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true, title: true }, orderBy: { name: "asc" } }),
    prisma.matter.findMany({ select: { id: true, title: true, matterNumber: true }, orderBy: { title: "asc" } }),
  ]);
  return { assignees, matters };
}
