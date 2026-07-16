import { startOfDay, endOfDay, addDays, startOfWeek } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { TaskStatus } from "@/generated/prisma/client";
import { matterScopeFilter, getMatters } from "@/features/matters/queries";
import { getDocuments } from "@/features/documents/queries";
import { getRecentActivity } from "@/features/activity/queries";

const now = () => new Date();

async function getMyTodaysSchedule(userId: string) {
  const today = now();
  const [hearings, meetings, tasks] = await Promise.all([
    prisma.hearing.findMany({
      where: { scheduledAt: { gte: startOfDay(today), lte: endOfDay(today) }, matter: matterScopeFilter(userId) },
      include: { matter: { select: { title: true } } },
    }),
    prisma.meeting.findMany({
      where: {
        scheduledAt: { gte: startOfDay(today), lte: endOfDay(today) },
        OR: [{ matter: matterScopeFilter(userId) }, { client: { relationshipManagerId: userId } }],
      },
      include: { client: { select: { name: true } }, matter: { select: { title: true } } },
    }),
    prisma.task.findMany({
      where: {
        dueDate: { gte: startOfDay(today), lte: endOfDay(today) },
        status: { not: TaskStatus.DONE },
        assigneeId: userId,
      },
      include: { assignee: { select: { name: true } } },
    }),
  ]);

  return [
    ...hearings.map((h) => ({ id: h.id, type: "hearing" as const, time: h.scheduledAt, title: `${h.hearingType} — ${h.matter.title}`, meta: h.courtName })),
    ...meetings.map((m) => ({ id: m.id, type: "meeting" as const, time: m.scheduledAt, title: m.title, meta: m.client?.name ?? m.matter?.title ?? "" })),
    ...tasks.map((t) => ({ id: t.id, type: "task" as const, time: t.dueDate ?? today, title: t.title, meta: t.assignee.name })),
  ].sort((a, b) => a.time.getTime() - b.time.getTime());
}

async function getMyDeadlinesThisWeek(userId: string) {
  const today = now();
  return prisma.task.findMany({
    where: {
      assigneeId: userId,
      status: { not: TaskStatus.DONE },
      dueDate: { gte: startOfDay(today), lte: endOfDay(addDays(today, 7)) },
    },
    include: { assignee: { select: { name: true } }, matter: { select: { title: true, matterNumber: true } } },
    orderBy: { dueDate: "asc" },
    take: 6,
  });
}

async function getMyTaskOverview(userId: string) {
  const grouped = await prisma.task.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: { assigneeId: userId },
  });
  const map = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Record<TaskStatus, number>;
  return [
    { status: "To Do", count: map.TODO ?? 0 },
    { status: "In Progress", count: map.IN_PROGRESS ?? 0 },
    { status: "In Review", count: map.IN_REVIEW ?? 0 },
    { status: "Done", count: map.DONE ?? 0 },
  ];
}

async function getMyRecentDocuments(userId: string) {
  const documents = await getDocuments({ scopeUserId: userId });
  return documents.slice(0, 5);
}

async function getMyMatters(userId: string) {
  const matters = await getMatters({ scopeUserId: userId });
  return matters.slice(0, 6);
}

async function getMyTimeThisWeek(userId: string, utilizationTarget: number) {
  const weekStart = startOfWeek(now(), { weekStartsOn: 1 });
  const result = await prisma.timeEntry.aggregate({
    _sum: { minutes: true },
    where: { userId, billable: true, date: { gte: weekStart } },
  });
  const loggedMinutes = result._sum.minutes ?? 0;

  const elapsedWorkingDays = Math.min(5, Math.max(1, now().getDay() === 0 ? 5 : now().getDay()));
  const targetMinutes = elapsedWorkingDays * 6 * 60 * (utilizationTarget / 100);

  return {
    loggedHours: Math.round((loggedMinutes / 60) * 10) / 10,
    targetHours: Math.round((targetMinutes / 60) * 10) / 10,
    pct: targetMinutes > 0 ? Math.min(100, Math.round((loggedMinutes / targetMinutes) * 100)) : 0,
  };
}

export async function getPersonalDashboardData(userId: string, utilizationTarget: number) {
  const [todaysSchedule, deadlinesThisWeek, taskOverview, recentDocuments, myMatters, timeThisWeek, recentActivity] =
    await Promise.all([
      getMyTodaysSchedule(userId),
      getMyDeadlinesThisWeek(userId),
      getMyTaskOverview(userId),
      getMyRecentDocuments(userId),
      getMyMatters(userId),
      getMyTimeThisWeek(userId, utilizationTarget),
      getRecentActivity(6, { scopeUserId: userId }),
    ]);

  return { todaysSchedule, deadlinesThisWeek, taskOverview, recentDocuments, myMatters, timeThisWeek, recentActivity };
}

export type PersonalDashboardData = Awaited<ReturnType<typeof getPersonalDashboardData>>;
