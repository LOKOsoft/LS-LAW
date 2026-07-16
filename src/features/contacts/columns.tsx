"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/format";
import type { ContactListItem } from "@/features/contacts/queries";

export const contactColumns: ColumnDef<ContactListItem>[] = [
  {
    accessorKey: "name",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.title ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "company.name",
    header: "Company",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.company?.name ?? "—"}</span>,
  },
  {
    accessorKey: "client.name",
    header: "Client",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.client?.name ?? "—"}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email ?? "—"}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone ?? "—"}</span>,
  },
  {
    accessorKey: "isPrimary",
    header: "Primary",
    cell: ({ row }) => (row.original.isPrimary ? <Badge variant="secondary">Primary</Badge> : null),
  },
];
