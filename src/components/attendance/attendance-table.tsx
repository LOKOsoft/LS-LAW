"use client";

import { CalendarCheck } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { attendanceColumns } from "@/features/attendance/columns";
import type { AttendanceListItem } from "@/features/attendance/queries";

export function AttendanceTable({ records }: { records: AttendanceListItem[] }) {
  return (
    <DataTable
      columns={attendanceColumns}
      data={records}
      emptyIcon={CalendarCheck}
      emptyTitle="No attendance records"
      emptyDescription="Daily attendance will appear here."
      pageSize={15}
    />
  );
}
