"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusPill, type StatusTone } from "@/components/shared/status-pill";
import { formatDate, formatTime, initials } from "@/lib/format";
import type { AttendanceListItem } from "@/features/attendance/queries";

const ATTENDANCE_TONE: Record<string, StatusTone> = {
  PRESENT: "success",
  WORK_FROM_HOME: "info",
  HALF_DAY: "warning",
  ABSENT: "destructive",
  ON_LEAVE: "neutral",
};

export const attendanceColumns: ColumnDef<AttendanceListItem>[] = [
  {
    accessorKey: "user.name",
    header: "Employee",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(row.original.user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.user.title ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-sm text-foreground">{formatDate(row.original.date)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusPill label={row.original.status.replace(/_/g, " ")} tone={ATTENDANCE_TONE[row.original.status] ?? "neutral"} />
    ),
  },
  {
    accessorKey: "checkIn",
    header: "Check-in",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.checkIn ? formatTime(row.original.checkIn) : "—"}</span>,
  },
  {
    accessorKey: "checkOut",
    header: "Check-out",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.checkOut ? formatTime(row.original.checkOut) : "—"}</span>,
  },
];
