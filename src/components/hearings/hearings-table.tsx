"use client";

import { Gavel } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hearingColumns } from "@/features/hearings/columns";
import type { HearingListItem } from "@/features/hearings/queries";
import { useTableFilters } from "@/hooks/use-table-filters";

export function HearingsTable({ hearings }: { hearings: HearingListItem[] }) {
  const { search, setSearch, filterValue: status, setFilterValue: setStatus, filtered } = useTableFilters(hearings, {
    search: (h, q) =>
      h.hearingType.toLowerCase().includes(q) ||
      h.courtName.toLowerCase().includes(q) ||
      h.matter.title.toLowerCase().includes(q),
    filter: (h, value) => h.status === value,
  });

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search hearings by type, court, matter..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ADJOURNED">Adjourned</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={hearingColumns}
        data={filtered}
        emptyIcon={Gavel}
        emptyTitle="No hearings found"
        emptyDescription="Try adjusting your search or filters, or schedule a new hearing."
      />
    </div>
  );
}
