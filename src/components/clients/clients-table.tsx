"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientColumns } from "@/features/clients/columns";
import type { ClientListItem } from "@/features/clients/queries";

export function ClientsTable({ clients }: { clients: ClientListItem[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>("ALL");

  const filtered = React.useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        search.trim().length === 0 ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.clientNumber.toLowerCase().includes(search.toLowerCase()) ||
        (c.industry ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || c.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, status]);

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clients by name, number, industry..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PROSPECT">Prospect</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={clientColumns}
        data={filtered}
        emptyIcon={Users}
        emptyTitle="No clients found"
        emptyDescription="Try adjusting your search or filters, or add a new client."
        onRowClick={(client) => router.push(`/managing-partner/clients/${client.id}`)}
      />
    </div>
  );
}
