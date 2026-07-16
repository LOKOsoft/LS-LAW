"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { HearingStatusPill } from "@/components/shared/status-pill";
import { formatDateTime } from "@/lib/format";
import type { HearingListItem } from "@/features/hearings/queries";

export const hearingColumns: ColumnDef<HearingListItem>[] = [
  {
    accessorKey: "hearingType",
    header: "Hearing",
    cell: ({ row }) => (
      <div className="min-w-0 max-w-xs">
        <p className="truncate text-sm font-medium text-foreground">{row.original.hearingType}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.matter.title} · {row.original.matter.matterNumber}</p>
      </div>
    ),
  },
  { accessorKey: "courtName", header: "Court", cell: ({ row }) => <span className="text-sm text-foreground">{row.original.courtName}</span> },
  { accessorKey: "judge", header: "Judge", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.judge ?? "—"}</span> },
  { accessorKey: "scheduledAt", header: "Scheduled", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDateTime(row.original.scheduledAt)}</span> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <HearingStatusPill status={row.original.status} /> },
];
