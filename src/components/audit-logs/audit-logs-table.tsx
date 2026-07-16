"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { auditLogColumns } from "@/features/audit-logs/columns";
import type { AuditLogItem } from "@/features/audit-logs/queries";

export function AuditLogsTable({ logs }: { logs: AuditLogItem[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (search.trim().length === 0) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.actor.name.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.matter?.title.toLowerCase().includes(q) ?? false) ||
        (l.client?.name.toLowerCase().includes(q) ?? false),
    );
  }, [logs, search]);

  return (
    <div>
      <DataTableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by actor, action, matter, client..." />
      <DataTable
        columns={auditLogColumns}
        data={filtered}
        emptyIcon={ShieldCheck}
        emptyTitle="No audit activity"
        emptyDescription="Every mutating action across the firm will appear here."
        pageSize={20}
      />
    </div>
  );
}
