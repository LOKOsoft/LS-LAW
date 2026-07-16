import { PageHeader } from "@/components/shared/page-header";
import { ClausesTable } from "@/components/clauses/clauses-table";
import { getClauses } from "@/features/clauses/queries";

export default async function ClauseLibraryPage() {
  const clauses = await getClauses();

  return (
    <div>
      <PageHeader title="Clause Library" description="The firm's approved clause bank for drafting and review." />
      <ClausesTable clauses={clauses} />
    </div>
  );
}
