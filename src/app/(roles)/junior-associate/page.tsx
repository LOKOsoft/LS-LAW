import { PageHeader } from "@/components/shared/page-header";
import { TodaysScheduleCard } from "@/components/dashboard/todays-schedule-card";
import { UpcomingDeadlinesCard } from "@/components/dashboard/upcoming-deadlines-card";
import { TaskOverviewCard } from "@/components/dashboard/task-overview-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { MyMattersCard } from "@/components/dashboard/my-matters-card";
import { MyRecentDocumentsCard } from "@/components/dashboard/my-recent-documents-card";
import { MyTimeThisWeekCard } from "@/components/dashboard/my-time-this-week-card";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { getPersonalDashboardData } from "@/features/dashboard/personal-dashboard-queries";
import { JUNIOR_ASSOCIATE_BASE } from "@/lib/constants/nav";

export default async function JuniorAssociateDashboardPage() {
  const user = await requireUser(Role.JUNIOR_ASSOCIATE);
  const data = await getPersonalDashboardData(user.id, user.utilizationTarget);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Your matters, deadlines, and today's schedule at a glance."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <TodaysScheduleCard items={data.todaysSchedule} />
        <UpcomingDeadlinesCard tasks={data.deadlinesThisWeek} basePath={JUNIOR_ASSOCIATE_BASE} />
        <MyTimeThisWeekCard {...data.timeThisWeek} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <MyMattersCard matters={data.myMatters} basePath={JUNIOR_ASSOCIATE_BASE} />
        <TaskOverviewCard data={data.taskOverview} description="Your task board status" />
        <MyRecentDocumentsCard documents={data.recentDocuments} basePath={JUNIOR_ASSOCIATE_BASE} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivityCard items={data.recentActivity} description="Latest activity on your matters" />
      </div>
    </div>
  );
}
