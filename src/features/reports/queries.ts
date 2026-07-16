import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { prisma } from "@/lib/db/prisma";

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
    where: { role: { in: ["MANAGING_PARTNER", "SENIOR_PARTNER", "ASSOCIATE"] } },
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

  return { revenueTrend, monthlyGrowth, practiceAreaDistribution, matterStatus, lawyerPerformance: lawyerPerformance.slice(0, 8) };
}
