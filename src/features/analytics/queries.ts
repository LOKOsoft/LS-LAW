import { prisma } from "@/lib/db/prisma";

export async function getAnalyticsData() {
  const [revenueByPracticeArea, mattersByAttorney, hoursByAttorney, expensesByCategory] = await Promise.all([
    prisma.matter.groupBy({ by: ["practiceAreaId"], _sum: { estimatedValue: true } }),
    prisma.matter.groupBy({ by: ["responsibleAttorneyId"], _count: { _all: true } }),
    prisma.timeEntry.groupBy({ by: ["userId"], _sum: { minutes: true } }),
    prisma.expense.groupBy({ by: ["category"], _sum: { amount: true } }),
  ]);

  const [practiceAreas, users] = await Promise.all([
    prisma.practiceArea.findMany({ select: { id: true, name: true, color: true } }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);
  const paName = Object.fromEntries(practiceAreas.map((p) => [p.id, p.name]));
  const paColor = Object.fromEntries(practiceAreas.map((p) => [p.id, p.color]));
  const userName = Object.fromEntries(users.map((u) => [u.id, u.name]));

  return {
    revenueByPracticeArea: revenueByPracticeArea
      .map((g) => ({ name: paName[g.practiceAreaId] ?? "Unknown", value: g._sum.estimatedValue ?? 0, color: paColor[g.practiceAreaId] }))
      .sort((a, b) => b.value - a.value),
    mattersByAttorney: mattersByAttorney
      .map((g) => ({ name: userName[g.responsibleAttorneyId] ?? "Unknown", value: g._count._all }))
      .sort((a, b) => b.value - a.value),
    hoursByAttorney: hoursByAttorney
      .map((g) => ({ name: userName[g.userId] ?? "Unknown", value: Math.round((g._sum.minutes ?? 0) / 60) }))
      .filter((g) => g.value > 0)
      .sort((a, b) => b.value - a.value),
    expensesByCategory: expensesByCategory
      .map((g) => ({ name: g.category, value: g._sum.amount ?? 0 }))
      .sort((a, b) => b.value - a.value),
  };
}

export type AnalyticsData = Awaited<ReturnType<typeof getAnalyticsData>>;
