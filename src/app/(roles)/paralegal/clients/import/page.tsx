import { PageHeader } from "@/components/shared/page-header";
import { ImportClientsView } from "@/components/clients/import-clients-view";
import { getRelationshipManagerOptions } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { PARALEGAL_BASE } from "@/lib/constants/nav";

export default async function ParalegalImportClientsPage() {
  const [managers, currentUser] = await Promise.all([getRelationshipManagerOptions(), requireUser(Role.PARALEGAL)]);

  return (
    <div>
      <PageHeader title="Import Clients" description="Bring in clients in bulk from a CSV export of another system." />
      <ImportClientsView managers={managers} currentUserId={currentUser.id} basePath={PARALEGAL_BASE} />
    </div>
  );
}
