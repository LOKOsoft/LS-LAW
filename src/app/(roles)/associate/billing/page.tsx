import { PageHeader } from "@/components/shared/page-header";
import { BillingSummary } from "@/components/billing/billing-summary";
import { BillingTabs } from "@/components/billing/billing-tabs";
import { NewInvoiceForm } from "@/components/billing/new-invoice-form";
import { getInvoices, getPayments, getExpenses, getRetainers, getBillingSummary, getUnbilledTimeByMatter } from "@/features/billing/queries";
import { UnbilledTimeCard } from "@/components/billing/unbilled-time-card";
import { matterScopeFilter } from "@/features/matters/queries";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function AssociateBillingPage() {
  const user = await requireUser(Role.ASSOCIATE);
  const scope = { scopeUserId: user.id };

  const [invoices, payments, expenses, retainers, summary, clients, matters, unbilledTime] = await Promise.all([
    getInvoices(scope),
    getPayments(scope),
    getExpenses(scope),
    getRetainers(scope),
    getBillingSummary(scope),
    prisma.client.findMany({
      where: { matters: { some: matterScopeFilter(user.id) } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.matter.findMany({
      where: matterScopeFilter(user.id),
      select: { id: true, title: true, matterNumber: true },
      orderBy: { title: "asc" },
    }),
    getUnbilledTimeByMatter(scope),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Billing"
        description="Invoices, payments, expenses, and retainers on your matters."
        actions={<NewInvoiceForm clients={clients} matters={matters} />}
      />
      <BillingSummary summary={summary} />
      <UnbilledTimeCard items={unbilledTime} />
      <BillingTabs invoices={invoices} payments={payments} expenses={expenses} retainers={retainers} />
    </div>
  );
}
