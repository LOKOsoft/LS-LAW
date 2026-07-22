"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, ArchiveRestore } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { clientColumns } from "@/features/clients/columns";
import { restoreClient } from "@/features/clients/actions";
import type { ClientListItem } from "@/features/clients/queries";
import { useTableFilters } from "@/hooks/use-table-filters";

export function ArchivedClientsTable({
  clients,
  basePath = "/managing-partner",
  canRestore = true,
}: {
  clients: ClientListItem[];
  basePath?: string;
  canRestore?: boolean;
}) {
  const router = useRouter();
  const { search, setSearch, filtered } = useTableFilters(clients, {
    search: (c, q) => c.name.toLowerCase().includes(q) || c.clientNumber.toLowerCase().includes(q),
  });

  async function handleRestore(clientId: string, name: string) {
    try {
      await restoreClient(clientId);
      toast.success("Client restored", { description: `${name} is active again.` });
      router.refresh();
    } catch {
      toast.error("Could not restore client. Please try again.");
    }
  }

  const columns: ColumnDef<ClientListItem>[] = canRestore
    ? [
        ...clientColumns,
        {
          id: "restore",
          header: "",
          cell: ({ row }) => (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                void handleRestore(row.original.id, row.original.name);
              }}
            >
              <ArchiveRestore className="size-4" />
              Restore
            </Button>
          ),
        },
      ]
    : clientColumns;

  return (
    <div>
      <DataTableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search archived clients..." />
      <DataTable
        columns={columns}
        data={filtered}
        emptyIcon={Archive}
        emptyTitle="No archived clients"
        emptyDescription="Clients you archive will appear here, fully restorable at any time."
        onRowClick={(client) => router.push(`${basePath}/clients/${client.id}`)}
      />
    </div>
  );
}
