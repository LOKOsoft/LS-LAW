"use client";

import { useRouter } from "next/navigation";
import { Landmark } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { courtCaseColumns } from "@/features/court-cases/columns";
import type { CourtCaseListItem } from "@/features/court-cases/queries";

export function CourtCasesTable({ cases, basePath = "/managing-partner" }: { cases: CourtCaseListItem[]; basePath?: string }) {
  const router = useRouter();
  return (
    <DataTable
      columns={courtCaseColumns}
      data={cases}
      emptyIcon={Landmark}
      emptyTitle="No court cases found"
      emptyDescription="Litigation matters with a filed case will appear here."
      onRowClick={(c) => router.push(`${basePath}/matters/${c.matter.id}`)}
    />
  );
}
