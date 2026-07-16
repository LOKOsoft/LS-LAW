import { PageHeader } from "@/components/shared/page-header";
import { AttendanceSummary } from "@/components/attendance/attendance-summary";
import { LeavesList } from "@/components/leaves/leaves-list";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { getTodayAttendanceSummary } from "@/features/attendance/queries";
import { getLeaveRequests } from "@/features/leaves/queries";

export default async function HrDashboardPage() {
  const user = await requireUser(Role.HR);
  const [summary, leaveRequests] = await Promise.all([getTodayAttendanceSummary(), getLeaveRequests()]);
  const pendingLeaves = leaveRequests.filter((r) => r.status === "PENDING");

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Attendance, leave approvals, and people operations for the firm."
      />

      <AttendanceSummary summary={summary} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Pending leave requests ({pendingLeaves.length})</h2>
        <LeavesList requests={pendingLeaves} />
      </div>
    </div>
  );
}
