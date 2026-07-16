import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus, type Prisma } from "@/generated/prisma/client";
import { matterScopeFilter } from "@/features/matters/queries";

export async function getInvoices(options?: { scopeUserId?: string }) {
  return prisma.invoice.findMany({
    where: options?.scopeUserId ? { matter: matterScopeFilter(options.scopeUserId) } : undefined,
    orderBy: { issueDate: "desc" },
    include: { client: { select: { id: true, name: true } }, matter: { select: { title: true } } },
  });
}
export type InvoiceListItem = Awaited<ReturnType<typeof getInvoices>>[number];

export async function getPayments(options?: { scopeUserId?: string }) {
  return prisma.payment.findMany({
    where: options?.scopeUserId ? { invoice: { matter: matterScopeFilter(options.scopeUserId) } } : undefined,
    orderBy: { paidAt: "desc" },
    include: { client: { select: { name: true } }, invoice: { select: { invoiceNumber: true } } },
  });
}
export type PaymentListItem = Awaited<ReturnType<typeof getPayments>>[number];

export async function getExpenses(options?: { scopeUserId?: string }) {
  return prisma.expense.findMany({
    where: options?.scopeUserId ? { matter: matterScopeFilter(options.scopeUserId) } : undefined,
    orderBy: { incurredAt: "desc" },
    include: { matter: { select: { title: true } }, client: { select: { name: true } }, submittedBy: { select: { name: true } } },
  });
}
export type ExpenseListItem = Awaited<ReturnType<typeof getExpenses>>[number];

export async function getRetainers(options?: { scopeUserId?: string }) {
  return prisma.retainer.findMany({
    where: options?.scopeUserId ? { matter: matterScopeFilter(options.scopeUserId) } : undefined,
    orderBy: { startDate: "desc" },
    include: { client: { select: { name: true } }, matter: { select: { title: true } } },
  });
}
export type RetainerListItem = Awaited<ReturnType<typeof getRetainers>>[number];

export async function getBillingSummary(options?: { scopeUserId?: string }) {
  const invoiceScope: Prisma.InvoiceWhereInput | undefined = options?.scopeUserId
    ? { matter: matterScopeFilter(options.scopeUserId) }
    : undefined;
  const paymentScope: Prisma.PaymentWhereInput | undefined = options?.scopeUserId
    ? { invoice: { matter: matterScopeFilter(options.scopeUserId) } }
    : undefined;

  const [invoices, payments] = await Promise.all([
    prisma.invoice.findMany({ where: invoiceScope, select: { total: true, amountPaid: true, status: true } }),
    prisma.payment.findMany({ where: paymentScope, select: { amount: true } }),
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
      prisma.invoice.aggregate({
        _sum: { total: true },
        where: { ...invoiceScope, issueDate: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { ...paymentScope, paidAt: { gte: monthStart, lte: monthEnd } },
      }),
    ]);
    trend.push({ month: format(target, "MMM"), billed: billed._sum.total ?? 0, collected: collected._sum.amount ?? 0 });
  }

  return { outstanding, totalBilled, totalCollected, overdueCount, trend };
}

export async function getUnbilledTimeByMatter(options?: { scopeUserId?: string }) {
  const entries = await prisma.timeEntry.findMany({
    where: options?.scopeUserId
      ? { billable: true, invoiced: false, matter: matterScopeFilter(options.scopeUserId) }
      : { billable: true, invoiced: false },
    include: {
      matter: { select: { id: true, title: true, matterNumber: true, hourlyRate: true, clientId: true, client: { select: { name: true } } } },
      user: { select: { name: true } },
    },
    orderBy: { date: "asc" },
  });

  const byMatter = new Map<string, { matter: (typeof entries)[number]["matter"]; minutes: number; entryCount: number }>();
  for (const entry of entries) {
    const existing = byMatter.get(entry.matterId);
    if (existing) {
      existing.minutes += entry.minutes;
      existing.entryCount += 1;
    } else {
      byMatter.set(entry.matterId, { matter: entry.matter, minutes: entry.minutes, entryCount: 1 });
    }
  }

  return Array.from(byMatter.values()).map((m) => ({
    matterId: m.matter.id,
    matterTitle: m.matter.title,
    matterNumber: m.matter.matterNumber,
    clientName: m.matter.client.name,
    hours: Math.round((m.minutes / 60) * 10) / 10,
    entryCount: m.entryCount,
    estimatedAmount: Math.round((m.minutes / 60) * (m.matter.hourlyRate ?? 0)),
  }));
}
