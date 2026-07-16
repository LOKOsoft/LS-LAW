import { PageHeader } from "@/components/shared/page-header";
import { CompaniesTable } from "@/components/companies/companies-table";
import { getCompanies } from "@/features/companies/queries";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div>
      <PageHeader title="Companies" description="Corporate client organizations, distinct from individual client relationships." />
      <CompaniesTable companies={companies} />
    </div>
  );
}
