import { prisma } from "@/lib/db/prisma";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getTasks(options?: { scopeUserId?: string }) {
  return prisma.task.findMany({
    where: options?.scopeUserId
      ? {
          OR: [
            { assigneeId: options.scopeUserId },
            { createdById: options.scopeUserId },
            { matter: matterScopeFilter(options.scopeUserId) },
          ],
        }
      : undefined,
    orderBy: { dueDate: "asc" },
    include: {
      assignee: { select: { id: true, name: true } },
      matter: { select: { id: true, title: true, matterNumber: true } },
    },
  });
}
export type TaskListItem = Awaited<ReturnType<typeof getTasks>>[number];

export async function getTaskFormOptions(options?: { scopeUserId?: string }) {
  const [assignees, matters] = await Promise.all([
    prisma.user.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true, title: true }, orderBy: { name: "asc" } }),
    prisma.matter.findMany({
      where: options?.scopeUserId ? matterScopeFilter(options.scopeUserId) : undefined,
      select: { id: true, title: true, matterNumber: true },
      orderBy: { title: "asc" },
    }),
  ]);
  return { assignees, matters };
}
