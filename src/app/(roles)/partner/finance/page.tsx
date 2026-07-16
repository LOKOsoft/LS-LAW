import { PageHeader } from "@/components/shared/page-header";
import { FinanceOverview } from "@/components/finance/finance-overview";
import { getFinanceOverview } from "@/features/finance/queries";

export default async function PartnerFinancePage() {
  const data = await getFinanceOverview();

  return (
    <div>
      <PageHeader title="Finance" description="Firm-wide financial overview — revenue, expenses, and net position." />
      <FinanceOverview data={data} />
    </div>
  );
}
