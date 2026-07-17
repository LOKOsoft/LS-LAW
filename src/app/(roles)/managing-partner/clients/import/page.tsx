import { PageHeader } from "@/components/shared/page-header";
import { ImportClientsView } from "@/components/clients/import-clients-view";
import { getRelationshipManagerOptions } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { MANAGING_PARTNER_BASE } from "@/lib/constants/nav";

export default async function ImportClientsPage() {
  const [managers, currentUser] = await Promise.all([getRelationshipManagerOptions(), requireUser()]);

  return (
    <div>
      <PageHeader title="Import Clients" description="Bring in clients in bulk from a CSV export of another system." />
      <ImportClientsView managers={managers} currentUserId={currentUser.id} basePath={MANAGING_PARTNER_BASE} />
    </div>
  );
}
