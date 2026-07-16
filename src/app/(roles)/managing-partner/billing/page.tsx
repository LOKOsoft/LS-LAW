import { PageHeader } from "@/components/shared/page-header";
import { BillingSummary } from "@/components/billing/billing-summary";
import { BillingTabs } from "@/components/billing/billing-tabs";
import { NewInvoiceForm } from "@/components/billing/new-invoice-form";
import { getInvoices, getPayments, getExpenses, getRetainers, getBillingSummary } from "@/features/billing/queries";
import { prisma } from "@/lib/db/prisma";

export default async function BillingPage() {
  const [invoices, payments, expenses, retainers, summary, clients, matters] = await Promise.all([
    getInvoices(),
    getPayments(),
    getExpenses(),
    getRetainers(),
    getBillingSummary(),
    prisma.client.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.matter.findMany({ select: { id: true, title: true, matterNumber: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Billing"
        description="Invoices, payments, expenses, and retainers across the firm."
        actions={<NewInvoiceForm clients={clients} matters={matters} />}
      />
      <BillingSummary summary={summary} />
      <BillingTabs invoices={invoices} payments={payments} expenses={expenses} retainers={retainers} />
    </div>
  );
}
