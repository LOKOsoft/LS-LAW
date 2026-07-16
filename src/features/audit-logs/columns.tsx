"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, initials } from "@/lib/format";
import type { AuditLogItem } from "@/features/audit-logs/queries";

export const auditLogColumns: ColumnDef<AuditLogItem>[] = [
  {
    accessorKey: "actor.name",
    header: "Actor",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(row.original.actor.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.actor.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.actor.role.replace(/_/g, " ")}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.original.action} <span className="text-muted-foreground">{row.original.matter?.title ?? row.original.client?.name ?? ""}</span>
      </span>
    ),
  },
  {
    accessorKey: "entityType",
    header: "Entity",
    cell: ({ row }) => <Badge variant="secondary">{row.original.entityType}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => <span className="text-sm tabular-nums text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>,
  },
];
