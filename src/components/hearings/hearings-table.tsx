"use client";

import * as React from "react";
import { Gavel } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hearingColumns } from "@/features/hearings/columns";
import type { HearingListItem } from "@/features/hearings/queries";
import { useTableFilters } from "@/hooks/use-table-filters";
import { UpdateHearingDialog } from "@/components/hearings/update-hearing-dialog";

export function HearingsTable({ hearings }: { hearings: HearingListItem[] }) {
  const [selected, setSelected] = React.useState<HearingListItem | null>(null);
  const courts = React.useMemo(() => Array.from(new Set(hearings.map((h) => h.courtName))).sort(), [hearings]);

  const { search, setSearch, filterValue: status, setFilterValue: setStatus, filters, setFilter, filtered } = useTableFilters(
    hearings,
    {
      search: (h, q) =>
        h.hearingType.toLowerCase().includes(q) ||
        h.courtName.toLowerCase().includes(q) ||
        h.matter.title.toLowerCase().includes(q),
      filter: (h, value) => h.status === value,
      filters: {
        court: (h, value) => h.courtName === value,
      },
    },
  );

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search hearings by type, court, matter..."
        filters={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40" aria-label="Filter by status">
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
            <Select value={filters.court ?? "ALL"} onValueChange={(v) => setFilter("court", v)}>
              <SelectTrigger className="w-48" aria-label="Filter by court">
                <SelectValue placeholder="Court" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All courts</SelectItem>
                {courts.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />
      <DataTable
        columns={hearingColumns}
        data={filtered}
        emptyIcon={Gavel}
        emptyTitle="No hearings found"
        emptyDescription="Try adjusting your search or filters, or schedule a new hearing."
        onRowClick={setSelected}
      />
      <UpdateHearingDialog hearing={selected} open={selected !== null} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
