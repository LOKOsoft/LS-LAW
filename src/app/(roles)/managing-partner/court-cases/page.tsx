import { PageHeader } from "@/components/shared/page-header";
import { CourtCasesTable } from "@/components/court-cases/court-cases-table";
import { getCourtCases } from "@/features/court-cases/queries";

export default async function CourtCasesPage() {
  const cases = await getCourtCases();

  return (
    <div>
      <PageHeader title="Court Cases" description="Litigation case tracker — filings, stage, and next hearing across matters." />
      <CourtCasesTable cases={cases} />
    </div>
  );
}
