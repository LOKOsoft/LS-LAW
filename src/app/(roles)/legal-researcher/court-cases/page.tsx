import { PageHeader } from "@/components/shared/page-header";
import { CourtCasesTable } from "@/components/court-cases/court-cases-table";
import { getCourtCases } from "@/features/court-cases/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { LEGAL_RESEARCHER_BASE } from "@/lib/constants/nav";

export default async function LegalResearcherCourtCasesPage() {
  const user = await requireUser(Role.LEGAL_RESEARCHER);
  const cases = await getCourtCases({ scopeUserId: user.id });

  return (
    <div>
      <PageHeader title="Court Cases" description="Litigation case tracker for your matters." />
      <CourtCasesTable cases={cases} basePath={LEGAL_RESEARCHER_BASE} />
    </div>
  );
}
