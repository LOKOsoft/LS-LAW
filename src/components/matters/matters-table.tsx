"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { matterColumns } from "@/features/matters/columns";
import type { MatterListItem } from "@/features/matters/queries";
import { useTableFilters } from "@/hooks/use-table-filters";

export function MattersTable({
  matters,
  basePath = "/managing-partner",
}: {
  matters: MatterListItem[];
  basePath?: string;
}) {
  const router = useRouter();
  const practiceAreas = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matters) map.set(m.practiceArea.id, m.practiceArea.name);
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [matters]);

  const { search, setSearch, filterValue: status, setFilterValue: setStatus, filters, setFilter, filtered } = useTableFilters(
    matters,
    {
      search: (m, q) =>
        m.title.toLowerCase().includes(q) ||
        m.matterNumber.toLowerCase().includes(q) ||
        m.client.name.toLowerCase().includes(q),
      filter: (m, value) => m.status === value,
      filters: {
        priority: (m, value) => m.priority === value,
        practiceArea: (m, value) => m.practiceArea.id === value,
      },
    },
  );

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search matters by title, number, client..."
        filters={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="INTAKE">Intake</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.priority ?? "ALL"} onValueChange={(v) => setFilter("priority", v)}>
              <SelectTrigger className="w-36" aria-label="Filter by priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.practiceArea ?? "ALL"} onValueChange={(v) => setFilter("practiceArea", v)}>
              <SelectTrigger className="w-44" aria-label="Filter by practice area">
                <SelectValue placeholder="Practice area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All practice areas</SelectItem>
                {practiceAreas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />
      <DataTable
        columns={matterColumns}
        data={filtered}
        emptyIcon={Briefcase}
        emptyTitle="No matters found"
        emptyDescription="Try adjusting your search or filters, or open a new matter."
        onRowClick={(matter) => router.push(`${basePath}/matters/${matter.id}`)}
      />
    </div>
  );
}
