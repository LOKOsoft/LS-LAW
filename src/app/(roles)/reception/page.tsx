import { PageHeader } from "@/components/shared/page-header";
import { TodaysScheduleCard } from "@/components/dashboard/todays-schedule-card";
import { RecentClientsCard } from "@/components/dashboard/recent-clients-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { getDashboardData } from "@/features/dashboard/queries";
import { RECEPTION_BASE, RECEPTION_MODULE_KEYS } from "@/lib/constants/nav";

export default async function ReceptionDashboardPage() {
  const user = await requireUser(Role.RECEPTION);
  const data = await getDashboardData();

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Today's schedule and client intake at a glance."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TodaysScheduleCard items={data.todaysSchedule} />
        <RecentClientsCard clients={data.recentClients} basePath={RECEPTION_BASE} />
      </div>

      <QuickActionsCard basePath={RECEPTION_BASE} allowedKeys={RECEPTION_MODULE_KEYS} />
    </div>
  );
}
