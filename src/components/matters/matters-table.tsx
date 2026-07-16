"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { matterColumns } from "@/features/matters/columns";
import type { MatterListItem } from "@/features/matters/queries";

export function MattersTable({
  matters,
  basePath = "/managing-partner",
}: {
  matters: MatterListItem[];
  basePath?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    return matters.filter((m) => {
      const matchesSearch =
        search.trim().length === 0 ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.matterNumber.toLowerCase().includes(search.toLowerCase()) ||
        m.client.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || m.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [matters, search, status]);

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
