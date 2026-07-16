"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientStatusPill } from "@/components/shared/status-pill";
import { initials, formatDate } from "@/lib/format";
import type { ClientListItem } from "@/features/clients/queries";

export const clientColumns: ColumnDef<ClientListItem>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.clientNumber}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.industry ?? "—"}</span>,
  },
  {
    accessorKey: "relationshipManager.name",
    header: "Relationship Manager",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.relationshipManager?.name ?? "—"}</span>,
  },
  {
    id: "matters",
    header: "Matters",
    cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original._count.matters}</span>,
  },
  {
    id: "invoices",
    header: "Invoices",
    cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original._count.invoices}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ClientStatusPill status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
  },
];
