import { PageHeader } from "@/components/shared/page-header";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { FirmKpisRow } from "@/components/dashboard/firm-kpis-row";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PracticeAreaChart } from "@/components/dashboard/practice-area-chart";
import { MatterPipelineChart } from "@/components/dashboard/matter-pipeline-chart";
import { TaskOverviewCard } from "@/components/dashboard/task-overview-card";
import { TeamUtilizationCard } from "@/components/dashboard/team-utilization-card";
import { TodaysScheduleCard } from "@/components/dashboard/todays-schedule-card";
import { UpcomingDeadlinesCard } from "@/components/dashboard/upcoming-deadlines-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { RecentClientsCard } from "@/components/dashboard/recent-clients-card";
import { DocumentStatusCard } from "@/components/dashboard/document-status-card";
import { AnnouncementsCard } from "@/components/dashboard/announcements-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { getDashboardData } from "@/features/dashboard/queries";
import { ADMINISTRATOR_BASE } from "@/lib/constants/nav";

export default async function AdministratorDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Administrator Console"
        description="Full firm-wide visibility, system configuration, and compliance oversight."
      />

      <KpiRow data={data} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RevenueChart data={data.revenueTrend} />
        <PracticeAreaChart data={data.practiceAreaDistribution} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <MatterPipelineChart data={data.matterCounts.pipeline} />
        <TaskOverviewCard data={data.taskOverview} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <TodaysScheduleCard items={data.todaysSchedule} />
        <UpcomingDeadlinesCard tasks={data.upcomingDeadlines} basePath={ADMINISTRATOR_BASE} />
        <TeamUtilizationCard data={data.utilization.byUser} />
      </div>

      <FirmKpisRow data={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <RecentActivityCard items={data.recentActivity} />
        <RecentClientsCard clients={data.recentClients} basePath={ADMINISTRATOR_BASE} />
        <QuickActionsCard basePath={ADMINISTRATOR_BASE} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DocumentStatusCard breakdown={data.documentStatus} recentUploads={data.recentUploads} basePath={ADMINISTRATOR_BASE} />
        <AnnouncementsCard items={data.announcements} />
      </div>
    </div>
  );
}
