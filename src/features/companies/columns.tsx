"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Building2 } from "lucide-react";
import type { CompanyListItem } from "@/features/companies/queries";

export const companyColumns: ColumnDef<CompanyListItem>[] = [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.industry ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "client.name",
    header: "Linked client",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.client?.name ?? "—"}</span>,
  },
  {
    id: "contacts",
    header: "Contacts",
    cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original._count.contacts}</span>,
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {[row.original.city, row.original.state].filter(Boolean).join(", ") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.website ?? "—"}</span>,
  },
];
