import { PageHeader } from "@/components/shared/page-header";
import { ReportsView } from "@/components/reports/reports-view";
import { getReportsData } from "@/features/reports/queries";

export default async function OfficeManagerReportsPage() {
  const data = await getReportsData();

  return (
    <div>
      <PageHeader title="Reports" description="Firm-wide operational analytics." />
      <ReportsView data={data} />
    </div>
  );
}
