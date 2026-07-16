"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusPill, type StatusTone } from "@/components/shared/status-pill";
import { formatDate } from "@/lib/format";
import type { CourtCaseListItem } from "@/features/court-cases/queries";

const STAGE_TONE: Record<string, StatusTone> = {
  FILING: "info",
  PRE_TRIAL: "info",
  TRIAL: "warning",
  ARGUMENTS: "warning",
  JUDGMENT_RESERVED: "primary",
  DISPOSED: "success",
  APPEAL: "destructive",
};

export const courtCaseColumns: ColumnDef<CourtCaseListItem>[] = [
  {
    accessorKey: "caseNumber",
    header: "Case number",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{row.original.caseNumber}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.matter.title}</p>
      </div>
    ),
  },
  {
    accessorKey: "matter.client.name",
    header: "Client",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.matter.client.name}</span>,
  },
  {
    accessorKey: "courtName",
    header: "Court",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.courtName}</span>,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => <StatusPill label={row.original.stage.replace(/_/g, " ")} tone={STAGE_TONE[row.original.stage] ?? "neutral"} />,
  },
  {
    accessorKey: "nextHearingDate",
    header: "Next hearing",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.nextHearingDate ? formatDate(row.original.nextHearingDate) : "—"}
      </span>
    ),
  },
];
