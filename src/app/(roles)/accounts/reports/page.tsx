import { PageHeader } from "@/components/shared/page-header";
import { ReportsView } from "@/components/reports/reports-view";
import { getReportsData } from "@/features/reports/queries";

export default async function AccountsReportsPage() {
  const data = await getReportsData();

  return (
    <div>
      <PageHeader title="Reports" description="Financial analytics across revenue, billing, and collections." />
      <ReportsView data={data} />
    </div>
  );
}
