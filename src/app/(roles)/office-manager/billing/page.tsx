import { PageHeader } from "@/components/shared/page-header";
import { BillingSummary } from "@/components/billing/billing-summary";
import { BillingTabs } from "@/components/billing/billing-tabs";
import { getInvoices, getPayments, getExpenses, getRetainers, getBillingSummary, getUnbilledTimeByMatter } from "@/features/billing/queries";
import { UnbilledTimeCard } from "@/components/billing/unbilled-time-card";

export default async function OfficeManagerBillingPage() {
  const [invoices, payments, expenses, retainers, summary, unbilledTime] = await Promise.all([
    getInvoices(),
    getPayments(),
    getExpenses(),
    getRetainers(),
    getBillingSummary(),
    getUnbilledTimeByMatter(),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Billing" description="Office expenses, invoices, and retainers across the firm." />
      <BillingSummary summary={summary} />
      <UnbilledTimeCard items={unbilledTime} />
      <BillingTabs invoices={invoices} payments={payments} expenses={expenses} retainers={retainers} />
    </div>
  );
}
