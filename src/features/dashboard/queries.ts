import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  addDays,
  format,
} from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { MatterStatus, TaskStatus, InvoiceStatus, DocumentStatus } from "@/generated/prisma/client";
import { getRecentActivity } from "@/features/activity/queries";

const now = () => new Date();

async function getRevenueThisMonth() {
  const monthStart = startOfMonth(now());
  const monthEnd = endOfMonth(now());
  const result = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { paidAt: { gte: monthStart, lte: monthEnd } },
  });
  return result._sum.amount ?? 0;
}

async function getRevenueLastMonth() {
  const lastMonth = subMonths(now(), 1);
  const result = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { paidAt: { gte: startOfMonth(lastMonth), lte: endOfMonth(lastMonth) } },
  });
  return result._sum.amount ?? 0;
}

async function getRevenueTrend(months = 8) {
  const points: { month: string; revenue: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const target = subMonths(now(), i);
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paidAt: { gte: startOfMonth(target), lte: endOfMonth(target) } },
    });
    points.push({ month: format(target, "MMM"), revenue: result._sum.amount ?? 0 });
  }
  return points;
}

async function getPendingBills() {
  const invoices = await prisma.invoice.findMany({
    where: { status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] } },
    select: { total: true, amountPaid: true, status: true },
  });
  const outstanding = invoices.reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
  const overdueCount = invoices.filter((inv) => inv.status === InvoiceStatus.OVERDUE).length;
  return { outstanding, count: invoices.length, overdueCount };
}

async function getMatterCounts() {
  const grouped = await prisma.matter.groupBy({ by: ["status"], _count: { _all: true } });
  const map = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Record<MatterStatus, number>;
  const open = (map.INTAKE ?? 0) + (map.ACTIVE ?? 0) + (map.ON_HOLD ?? 0);
  return {
    open,
    pipeline: [
      { status: "Intake", count: map.INTAKE ?? 0 },
      { status: "Active", count: map.ACTIVE ?? 0 },
      { status: "On Hold", count: map.ON_HOLD ?? 0 },
      { status: "Closed", count: map.CLOSED ?? 0 },
      { status: "Archived", count: map.ARCHIVED ?? 0 },
    ],
  };
}

async function getTodaysHearings() {
  const today = now();
  return prisma.hearing.findMany({
    where: { scheduledAt: { gte: startOfDay(today), lte: endOfDay(today) } },
    include: { matter: { select: { title: true, matterNumber: true, client: { select: { name: true } } } } },
    orderBy: { scheduledAt: "asc" },
  });
}

async function getUpcomingDeadlines() {
  const today = now();
  return prisma.task.findMany({
    where: {
      status: { not: TaskStatus.DONE },
      dueDate: { gte: startOfDay(today), lte: endOfDay(addDays(today, 10)) },
    },
    include: { assignee: { select: { name: true } }, matter: { select: { title: true, matterNumber: true } } },
    orderBy: { dueDate: "asc" },
    take: 6,
  });
}

async function getTeamUtilization() {
  const monthStart = startOfMonth(now());
  const feeEarners = await prisma.user.findMany({
    where: { utilizationTarget: { gt: 0 } },
    select: { id: true, name: true, utilizationTarget: true },
  });
  // Prorate capacity to elapsed working days this month (~5/7 of calendar days)
  // at a 6-billable-hour/day baseline, so a mid-month check-in reads sensibly
  // rather than comparing partial-month hours against a full month's target.
  const elapsedWorkingDays = Math.max(1, Math.round(now().getDate() * (5 / 7)));
  const capacityMinutes = elapsedWorkingDays * 6 * 60;

  const utilization = await Promise.all(
    feeEarners.map(async (user) => {
      const entries = await prisma.timeEntry.aggregate({
        _sum: { minutes: true },
        where: { userId: user.id, billable: true, date: { gte: monthStart } },
      });
      const loggedMinutes = entries._sum.minutes ?? 0;
      const pct = Math.min(100, Math.round((loggedMinutes / capacityMinutes) * 100));
      return { name: user.name, pct, target: user.utilizationTarget };
    }),
  );

  const average = utilization.length
    ? Math.round(utilization.reduce((sum, u) => sum + u.pct, 0) / utilization.length)
    : 0;

  return { average, byUser: utilization.sort((a, b) => b.pct - a.pct).slice(0, 6) };
}

async function getPracticeAreaDistribution() {
  const areas = await prisma.practiceArea.findMany({
    select: { id: true, name: true, color: true, _count: { select: { matters: true } } },
  });
  return areas
    .map((a) => ({ name: a.name, color: a.color, value: a._count.matters }))
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);
}

async function getTaskOverview() {
  const grouped = await prisma.task.groupBy({ by: ["status"], _count: { _all: true } });
  const map = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Record<TaskStatus, number>;
  return [
    { status: "To Do", count: map.TODO ?? 0 },
    { status: "In Progress", count: map.IN_PROGRESS ?? 0 },
    { status: "In Review", count: map.IN_REVIEW ?? 0 },
    { status: "Done", count: map.DONE ?? 0 },
  ];
}

async function getRecentClients() {
  return prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, clientNumber: true, industry: true, status: true, createdAt: true, type: true },
  });
}

async function getDocumentStatusBreakdown() {
  const grouped = await prisma.documentFile.groupBy({ by: ["status"], _count: { _all: true } });
  const map = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Record<DocumentStatus, number>;
  return [
    { status: "Draft", count: map.DRAFT ?? 0 },
    { status: "Final", count: map.FINAL ?? 0 },
    { status: "Shared", count: map.SHARED ?? 0 },
    { status: "Archived", count: map.ARCHIVED ?? 0 },
  ];
}

async function getRecentUploads() {
  return prisma.documentFile.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { matter: { select: { title: true } }, uploadedBy: { select: { name: true } } },
  });
}

async function getAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { publishedAt: "desc" }, take: 4 });
}

async function getTodaysSchedule() {
  const today = now();
  const [hearings, meetings, tasks] = await Promise.all([
    prisma.hearing.findMany({
      where: { scheduledAt: { gte: startOfDay(today), lte: endOfDay(today) } },
      include: { matter: { select: { title: true } } },
    }),
    prisma.meeting.findMany({
      where: { scheduledAt: { gte: startOfDay(today), lte: endOfDay(today) } },
      include: { client: { select: { name: true } }, matter: { select: { title: true } } },
    }),
    prisma.task.findMany({
      where: { dueDate: { gte: startOfDay(today), lte: endOfDay(today) }, status: { not: TaskStatus.DONE } },
      include: { assignee: { select: { name: true } } },
    }),
  ]);

  const items = [
    ...hearings.map((h) => ({ id: h.id, type: "hearing" as const, time: h.scheduledAt, title: `${h.hearingType} — ${h.matter.title}`, meta: h.courtName })),
    ...meetings.map((m) => ({ id: m.id, type: "meeting" as const, time: m.scheduledAt, title: m.title, meta: m.client?.name ?? m.matter?.title ?? "" })),
    ...tasks.map((t) => ({ id: t.id, type: "task" as const, time: t.dueDate ?? today, title: t.title, meta: t.assignee.name })),
  ].sort((a, b) => a.time.getTime() - b.time.getTime());

  return items;
}

async function getFirmKpis() {
  const [totalInvoiced, totalCollected, closedWonMatters, newClientsThisMonth] = await Promise.all([
    prisma.invoice.aggregate({ _sum: { total: true } }),
    prisma.invoice.aggregate({ _sum: { amountPaid: true } }),
    prisma.matter.count({ where: { status: MatterStatus.CLOSED } }),
    prisma.client.count({ where: { createdAt: { gte: startOfMonth(now()) } } }),
  ]);
  const invoiced = totalInvoiced._sum.total ?? 0;
  const collected = totalCollected._sum.amountPaid ?? 0;
  const collectionRate = invoiced > 0 ? Math.round((collected / invoiced) * 100) : 0;
  return { collectionRate, closedWonMatters, newClientsThisMonth };
}

export async function getDashboardData() {
  const [
    revenueThisMonth,
    revenueLastMonth,
    revenueTrend,
    pendingBills,
    matterCounts,
    todaysHearings,
    upcomingDeadlines,
    utilization,
    practiceAreaDistribution,
    taskOverview,
    recentClients,
    recentActivity,
    documentStatus,
    recentUploads,
    announcements,
    todaysSchedule,
    firmKpis,
  ] = await Promise.all([
    getRevenueThisMonth(),
    getRevenueLastMonth(),
    getRevenueTrend(),
    getPendingBills(),
    getMatterCounts(),
    getTodaysHearings(),
    getUpcomingDeadlines(),
    getTeamUtilization(),
    getPracticeAreaDistribution(),
    getTaskOverview(),
    getRecentClients(),
    getRecentActivity(6),
    getDocumentStatusBreakdown(),
    getRecentUploads(),
    getAnnouncements(),
    getTodaysSchedule(),
    getFirmKpis(),
  ]);

  const revenueTrendPct = revenueLastMonth > 0
    ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
    : 0;

  return {
    revenueThisMonth,
    revenueTrendPct,
    revenueTrend,
    pendingBills,
    matterCounts,
    todaysHearings,
    upcomingDeadlines,
    utilization,
    practiceAreaDistribution,
    taskOverview,
    recentClients,
    recentActivity,
    documentStatus,
    recentUploads,
    announcements,
    todaysSchedule,
    firmKpis,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
