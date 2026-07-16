import { PageHeader } from "@/components/shared/page-header";
import { CompaniesTable } from "@/components/companies/companies-table";
import { getCompanies } from "@/features/companies/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function LegalResearcherCompaniesPage() {
  const user = await requireUser(Role.LEGAL_RESEARCHER);
  const companies = await getCompanies({ scopeUserId: user.id });

  return (
    <div>
      <PageHeader title="Companies" description="Corporate organizations tied to your clients and matters." />
      <CompaniesTable companies={companies} />
    </div>
  );
}
