import { prisma } from "@/lib/db/prisma";

export async function getFinanceOverview() {
  const [payments, expenses, retainers, matters] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.expense.findMany({ select: { amount: true, category: true, billable: true } }),
    prisma.retainer.aggregate({ _sum: { balance: true } }),
    prisma.matter.findMany({
      select: { estimatedValue: true, practiceArea: { select: { name: true, color: true } } },
    }),
  ]);

  const totalRevenue = payments._sum.amount ?? 0;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const retainerBalance = retainers._sum.balance ?? 0;

  const expensesByCategory = Object.values(
    expenses.reduce<Record<string, { category: string; amount: number }>>((acc, e) => {
      acc[e.category] ??= { category: e.category, amount: 0 };
      acc[e.category].amount += e.amount;
      return acc;
    }, {}),
  ).sort((a, b) => b.amount - a.amount);

  const revenueByPracticeArea = Object.values(
    matters.reduce<Record<string, { name: string; color: string; value: number }>>((acc, m) => {
      const key = m.practiceArea.name;
      acc[key] ??= { name: key, color: m.practiceArea.color, value: 0 };
      acc[key].value += m.estimatedValue ?? 0;
      return acc;
    }, {}),
  ).sort((a, b) => b.value - a.value);

  return { totalRevenue, totalExpenses, netIncome, retainerBalance, expensesByCategory, revenueByPracticeArea };
}
