import { PageHeader } from "@/components/shared/page-header";
import { ReportsView } from "@/components/reports/reports-view";
import { getReportsData } from "@/features/reports/queries";

export default async function HrReportsPage() {
  const data = await getReportsData();

  return (
    <div>
      <PageHeader title="Reports" description="Firm-wide analytics relevant to people operations." />
      <ReportsView data={data} />
    </div>
  );
}
