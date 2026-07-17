import { PageHeader } from "@/components/shared/page-header";
import { ArchivedClientsTable } from "@/components/clients/archived-clients-table";
import { getArchivedClients } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { ACCOUNTS_BASE } from "@/lib/constants/nav";

export default async function AccountsArchivedClientsPage() {
  const currentUser = await requireUser();
  const clients = await getArchivedClients();

  return (
    <div>
      <PageHeader title="Archived Clients" description="Clients removed from the active list. Every matter, invoice, and document stays intact and restorable." />
      <ArchivedClientsTable clients={clients} currentUserId={currentUser.id} basePath={ACCOUNTS_BASE} canRestore={false} />
    </div>
  );
}
