import { PageHeader } from "@/components/shared/page-header";
import { ArchivedClientsTable } from "@/components/clients/archived-clients-table";
import { getArchivedClients } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { RECEPTION_BASE } from "@/lib/constants/nav";

export default async function ReceptionArchivedClientsPage() {
  await requireUser();
  const clients = await getArchivedClients();

  return (
    <div>
      <PageHeader title="Archived Clients" description="Clients removed from the active list. Every matter, invoice, and document stays intact and restorable." />
      <ArchivedClientsTable clients={clients} basePath={RECEPTION_BASE} canRestore={true} />
    </div>
  );
}
