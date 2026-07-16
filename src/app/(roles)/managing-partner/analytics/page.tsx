import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { getAnalyticsData } from "@/features/analytics/queries";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div>
      <PageHeader title="Analytics" description="Self-serve breakdowns beyond the fixed Reports dashboard." />
      <AnalyticsView data={data} />
    </div>
  );
}
