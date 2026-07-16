"use client";

import * as React from "react";
import { Gavel } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hearingColumns } from "@/features/hearings/columns";
import type { HearingListItem } from "@/features/hearings/queries";

export function HearingsTable({ hearings }: { hearings: HearingListItem[] }) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    return hearings.filter((h) => {
      const matchesSearch =
        search.trim().length === 0 ||
        h.hearingType.toLowerCase().includes(search.toLowerCase()) ||
        h.courtName.toLowerCase().includes(search.toLowerCase()) ||
        h.matter.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || h.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [hearings, search, status]);

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
