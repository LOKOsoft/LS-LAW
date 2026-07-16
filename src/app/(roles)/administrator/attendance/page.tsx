import { PageHeader } from "@/components/shared/page-header";
import { AttendanceSummary } from "@/components/attendance/attendance-summary";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { getRecentAttendance, getTodayAttendanceSummary } from "@/features/attendance/queries";

export default async function AttendancePage() {
  const [records, summary] = await Promise.all([getRecentAttendance(), getTodayAttendanceSummary()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Daily attendance tracking across the firm." />
      <AttendanceSummary summary={summary} />
      <AttendanceTable records={records} />
    </div>
  );
}
