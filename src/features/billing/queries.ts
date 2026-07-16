import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus } from "@/generated/prisma/client";

export async function getInvoices() {
  return prisma.invoice.findMany({
    orderBy: { issueDate: "desc" },
    include: { client: { select: { id: true, name: true } }, matter: { select: { title: true } } },
  });
}
export type InvoiceListItem = Awaited<ReturnType<typeof getInvoices>>[number];

export async function getPayments() {
  return prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: { client: { select: { name: true } }, invoice: { select: { invoiceNumber: true } } },
  });
}
export type PaymentListItem = Awaited<ReturnType<typeof getPayments>>[number];

export async function getExpenses() {
  return prisma.expense.findMany({
    orderBy: { incurredAt: "desc" },
    include: { matter: { select: { title: true } }, client: { select: { name: true } }, submittedBy: { select: { name: true } } },
  });
}
export type ExpenseListItem = Awaited<ReturnType<typeof getExpenses>>[number];

export async function getRetainers() {
  return prisma.retainer.findMany({
    orderBy: { startDate: "desc" },
    include: { client: { select: { name: true } }, matter: { select: { title: true } } },
  });
}
export type RetainerListItem = Awaited<ReturnType<typeof getRetainers>>[number];

export async function getBillingSummary() {
  const [invoices, payments] = await Promise.all([
    prisma.invoice.findMany({ select: { total: true, amountPaid: true, status: true } }),
    prisma.payment.findMany({ select: { amount: true } }),
  ]);

  const outstanding = invoices
    .filter((i) => i.status !== InvoiceStatus.PAID && i.status !== InvoiceStatus.VOID && i.status !== InvoiceStatus.DRAFT)
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);
  const totalBilled = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = invoices.filter((i) => i.status === InvoiceStatus.OVERDUE).length;

  const trend: { month: string; billed: number; collected: number }[] = [];
  for (let m = 5; m >= 0; m--) {
    const target = subMonths(new Date(), m);
    const monthStart = startOfMonth(target);
    const monthEnd = endOfMonth(target);
    const [billed, collected] = await Promise.all([
      prisma.invoice.aggregate({ _sum: { total: true }, where: { issueDate: { gte: monthStart, lte: monthEnd } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: monthStart, lte: monthEnd } } }),
    ]);
    trend.push({ month: format(target, "MMM"), billed: billed._sum.total ?? 0, collected: collected._sum.amount ?? 0 });
  }

  return { outstanding, totalBilled, totalCollected, overdueCount, trend };
}
