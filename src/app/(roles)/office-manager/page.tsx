import { PageHeader } from "@/components/shared/page-header";
import { TodaysScheduleCard } from "@/components/dashboard/todays-schedule-card";
import { AttendanceSummary } from "@/components/attendance/attendance-summary";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { getDashboardData } from "@/features/dashboard/queries";
import { getTodayAttendanceSummary } from "@/features/attendance/queries";

export default async function OfficeManagerDashboardPage() {
  const user = await requireUser(Role.OFFICE_MANAGER);
  const [data, attendanceSummary] = await Promise.all([getDashboardData(), getTodayAttendanceSummary()]);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Office operations, scheduling, and expenses at a glance."
      />

      <AttendanceSummary summary={attendanceSummary} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TodaysScheduleCard items={data.todaysSchedule} />
      </div>
    </div>
  );
}
