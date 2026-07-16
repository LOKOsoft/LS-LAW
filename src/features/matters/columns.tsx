"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MatterStatusPill, PriorityPill } from "@/components/shared/status-pill";
import { formatDate } from "@/lib/format";
import type { MatterListItem } from "@/features/matters/queries";

export const matterColumns: ColumnDef<MatterListItem>[] = [
  {
    accessorKey: "title",
    header: "Matter",
    cell: ({ row }) => (
      <div className="min-w-0 max-w-xs">
        <p className="truncate text-sm font-medium text-foreground">{row.original.title}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.matterNumber} · {row.original.client.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "practiceArea.name",
    header: "Practice area",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="whitespace-nowrap"
        style={{ borderColor: row.original.practiceArea.color, color: row.original.practiceArea.color }}
      >
        {row.original.practiceArea.name}
      </Badge>
    ),
  },
  {
    accessorKey: "responsibleAttorney.name",
    header: "Attorney",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.responsibleAttorney.name}</span>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <PriorityPill status={row.original.priority} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <MatterStatusPill status={row.original.status} />,
  },
  {
    accessorKey: "openedDate",
    header: "Opened",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.openedDate)}</span>,
  },
];
