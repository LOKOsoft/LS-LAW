"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Download, MoreHorizontal, Archive, Copy, Upload, UserCircle } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientColumns } from "@/features/clients/columns";
import type { ClientListItem } from "@/features/clients/queries";
import { useTableFilters } from "@/hooks/use-table-filters";
import { toCsv, downloadCsv } from "@/lib/csv";

export function ClientsTable({
  clients,
  basePath = "/managing-partner",
  canManage = true,
}: {
  clients: ClientListItem[];
  basePath?: string;
  /** Hides mutation-adjacent views (import, duplicate detection) for read-only roles. Archived clients and the relationship manager roster stay visible since they're read-only views. */
  canManage?: boolean;
}) {
  const router = useRouter();
  const { search, setSearch, filterValue: status, setFilterValue: setStatus, filtered } = useTableFilters(clients, {
    search: (c, q) =>
      c.name.toLowerCase().includes(q) ||
      c.clientNumber.toLowerCase().includes(q) ||
      (c.industry ?? "").toLowerCase().includes(q),
    filter: (c, value) => c.status === value,
  });

  function handleExport() {
    const csv = toCsv(filtered, [
      { key: "clientNumber", label: "Client Number" },
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "industry", label: "Industry" },
      { key: "status", label: "Status" },
    ]);
    downloadCsv(`clients-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clients by name, number, industry..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40" aria-label="Filter by status">
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
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
              <Download className="size-4" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="More client views">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`${basePath}/clients/relationship-manager`}>
                    <UserCircle className="size-4" />
                    Relationship manager view
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${basePath}/clients/archived`}>
                    <Archive className="size-4" />
                    Archived clients
                  </Link>
                </DropdownMenuItem>
                {canManage ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={`${basePath}/clients/duplicates`}>
                        <Copy className="size-4" />
                        Duplicate detection
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`${basePath}/clients/import`}>
                        <Upload className="size-4" />
                        Import clients
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      <DataTable
        columns={clientColumns}
        data={filtered}
        emptyIcon={Users}
        emptyTitle="No clients found"
        emptyDescription="Try adjusting your search or filters, or add a new client."
        onRowClick={(client) => router.push(`${basePath}/clients/${client.id}`)}
      />
    </div>
  );
}
