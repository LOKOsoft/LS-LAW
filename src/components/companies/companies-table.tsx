"use client";

import { Building2 } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { companyColumns } from "@/features/companies/columns";
import type { CompanyListItem } from "@/features/companies/queries";

export function CompaniesTable({ companies }: { companies: CompanyListItem[] }) {
  return (
    <DataTable
      columns={companyColumns}
      data={companies}
      emptyIcon={Building2}
      emptyTitle="No companies found"
      emptyDescription="Corporate client organizations will appear here."
    />
  );
}
