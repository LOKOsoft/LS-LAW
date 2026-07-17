import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus, TaskStatus } from "@/generated/prisma/client";

export async function getReportsData() {
  const now = new Date();

  const revenueTrend: { month: string; revenue: number }[] = [];
  for (let m = 11; m >= 0; m--) {
    const target = subMonths(now, m);
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paidAt: { gte: startOfMonth(target), lte: endOfMonth(target) } },
    });
    revenueTrend.push({ month: format(target, "MMM"), revenue: result._sum.amount ?? 0 });
  }
  const monthlyGrowth = revenueTrend.map((point, i) => {
    const prev = revenueTrend[i - 1];
    const growth = prev && prev.revenue > 0 ? Math.round(((point.revenue - prev.revenue) / prev.revenue) * 100) : 0;
    return { month: point.month, growth };
  });

  const practiceAreas = await prisma.practiceArea.findMany({
    select: { name: true, color: true, _count: { select: { matters: true } } },
  });
  const practiceAreaDistribution = practiceAreas
    .map((p) => ({ name: p.name, color: p.color, value: p._count.matters }))
    .filter((p) => p.value > 0);

  const matterStatusGrouped = await prisma.matter.groupBy({ by: ["status"], _count: { _all: true } });
  const matterStatus = matterStatusGrouped.map((g) => ({ status: g.status.replace(/_/g, " "), count: g._count._all }));

  const attorneys = await prisma.user.findMany({
    where: { role: { in: ["MANAGING_PARTNER", "SENIOR_PARTNER", "PARTNER", "ASSOCIATE", "JUNIOR_ASSOCIATE"] } },
    select: { id: true, name: true },
  });
  const lawyerPerformance = await Promise.all(
    attorneys.map(async (a) => {
      const [billed, hours] = await Promise.all([
        prisma.matter.aggregate({ _sum: { estimatedValue: true }, where: { responsibleAttorneyId: a.id } }),
        prisma.timeEntry.aggregate({ _sum: { minutes: true }, where: { userId: a.id } }),
      ]);
      return {
        name: a.name,
        value: billed._sum.estimatedValue ?? 0,
        hours: Math.round((hours._sum.minutes ?? 0) / 60),
      };
    }),
  );
  lawyerPerformance.sort((a, b) => b.value - a.value);

  const outstandingByClient = await getOutstandingPaymentsByClient();
  const taskCompletion = await getTaskCompletionRate();
  const clientGrowth = await getClientGrowth();

  return {
    revenueTrend,
    monthlyGrowth,
    practiceAreaDistribution,
    matterStatus,
    lawyerPerformance: lawyerPerformance.slice(0, 8),
    outstandingByClient,
    taskCompletion,
    clientGrowth,
  };
}

export async function getOutstandingPaymentsByClient() {
  const invoices = await prisma.invoice.findMany({
    where: { status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] } },
    select: { total: true, amountPaid: true, client: { select: { id: true, name: true } } },
  });

  const byClient = new Map<string, { name: string; outstanding: number }>();
  for (const inv of invoices) {
    const existing = byClient.get(inv.client.id) ?? { name: inv.client.name, outstanding: 0 };
    existing.outstanding += inv.total - inv.amountPaid;
    byClient.set(inv.client.id, existing);
  }

  return Array.from(byClient.values())
    .filter((c) => c.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding)
    .slice(0, 8);
}

export async function getTaskCompletionRate() {
  const grouped = await prisma.task.groupBy({ by: ["status"], _count: { _all: true } });
  const map = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Record<TaskStatus, number>;
  const total = Object.values(map).reduce((sum, n) => sum + n, 0);
  const completed = map.DONE ?? 0;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byPriority = await prisma.task.groupBy({ by: ["priority", "status"], _count: { _all: true } });
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
  const completionByPriority = priorities.map((priority) => {
    const rows = byPriority.filter((r) => r.priority === priority);
    const priorityTotal = rows.reduce((sum, r) => sum + r._count._all, 0);
    const priorityDone = rows.find((r) => r.status === TaskStatus.DONE)?._count._all ?? 0;
    return { priority, rate: priorityTotal > 0 ? Math.round((priorityDone / priorityTotal) * 100) : 0 };
  });

  return { total, completed, rate, byPriority: completionByPriority };
}

export async function getClientGrowth(months = 12) {
  const points: { month: string; newClients: number }[] = [];
  const now = new Date();
  for (let m = months - 1; m >= 0; m--) {
    const target = subMonths(now, m);
    const count = await prisma.client.count({
      where: { createdAt: { gte: startOfMonth(target), lte: endOfMonth(target) } },
    });
    points.push({ month: format(target, "MMM"), newClients: count });
  }
  return points;
}
