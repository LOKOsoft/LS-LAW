"use client";

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
  const { search, setSearch, filterValue: status, setFilterValue: setStatus, filtered } = useTableFilters(matters, {
    search: (m, q) =>
      m.title.toLowerCase().includes(q) ||
      m.matterNumber.toLowerCase().includes(q) ||
      m.client.name.toLowerCase().includes(q),
    filter: (m, value) => m.status === value,
  });

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search matters by title, number, client..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
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
