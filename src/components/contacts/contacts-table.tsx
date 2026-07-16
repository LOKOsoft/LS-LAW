"use client";

import { Contact as ContactIcon } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { contactColumns } from "@/features/contacts/columns";
import type { ContactListItem } from "@/features/contacts/queries";

export function ContactsTable({ contacts }: { contacts: ContactListItem[] }) {
  return (
    <DataTable
      columns={contactColumns}
      data={contacts}
      emptyIcon={ContactIcon}
      emptyTitle="No contacts found"
      emptyDescription="People at client organizations will appear here."
    />
  );
}
