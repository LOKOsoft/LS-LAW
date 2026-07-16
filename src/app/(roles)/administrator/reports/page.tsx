import { PageHeader } from "@/components/shared/page-header";
import { ReportsView } from "@/components/reports/reports-view";
import { getReportsData } from "@/features/reports/queries";

export default async function ReportsPage() {
  const data = await getReportsData();

  return (
    <div>
      <PageHeader title="Reports" description="Executive analytics across revenue, matters, and team performance." />
      <ReportsView data={data} />
    </div>
  );
}
