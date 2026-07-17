import { PageHeader } from "@/components/shared/page-header";
import { ArchivedClientsTable } from "@/components/clients/archived-clients-table";
import { getArchivedClients } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { ADMINISTRATOR_BASE } from "@/lib/constants/nav";

export default async function AdministratorArchivedClientsPage() {
  const currentUser = await requireUser();
  const clients = await getArchivedClients();

  return (
    <div>
      <PageHeader title="Archived Clients" description="Clients removed from the active list. Every matter, invoice, and document stays intact and restorable." />
      <ArchivedClientsTable clients={clients} currentUserId={currentUser.id} basePath={ADMINISTRATOR_BASE} canRestore={true} />
    </div>
  );
}
