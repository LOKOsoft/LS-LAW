"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials, formatDate } from "@/lib/format";
import type { TeamMember } from "@/features/hr/queries";
import { useTableFilters } from "@/hooks/use-table-filters";

export function TeamTable({ members }: { members: TeamMember[] }) {
  const roles = React.useMemo(() => Array.from(new Set(members.map((m) => m.role))), [members]);

  const { search, setSearch, filterValue: role, setFilterValue: setRole, filtered } = useTableFilters(members, {
    search: (m, q) => m.name.toLowerCase().includes(q),
    filter: (m, value) => m.role === value,
  });

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "name",
      header: "Team member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "title", header: "Title", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.title ?? "—"}</span> },
    { accessorKey: "role", header: "Role", cell: ({ row }) => <Badge variant="outline">{row.original.role.replace(/_/g, " ")}</Badge> },
    { accessorKey: "office.name", header: "Office", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.office?.name ?? "—"}</span> },
    {
      accessorKey: "utilizationTarget",
      header: "Utilization target",
      cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original.utilizationTarget > 0 ? `${row.original.utilizationTarget}%` : "—"}</span>,
    },
    { accessorKey: "joinedAt", header: "Joined", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.joinedAt)}</span> },
  ];

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search team members..."
        filters={
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-48" aria-label="Filter by role">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyIcon={Users}
        emptyTitle="No team members found"
        emptyDescription="Try adjusting your search or filters."
      />
    </div>
  );
}
