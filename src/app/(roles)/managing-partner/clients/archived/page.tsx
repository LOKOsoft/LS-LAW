import { PageHeader } from "@/components/shared/page-header";
import { ArchivedClientsTable } from "@/components/clients/archived-clients-table";
import { getArchivedClients } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { MANAGING_PARTNER_BASE } from "@/lib/constants/nav";

export default async function ArchivedClientsPage() {
  const [clients, currentUser] = await Promise.all([getArchivedClients(), requireUser()]);

  return (
    <div>
      <PageHeader title="Archived Clients" description="Clients removed from the active list. Every matter, invoice, and document stays intact and restorable." />
      <ArchivedClientsTable clients={clients} currentUserId={currentUser.id} basePath={MANAGING_PARTNER_BASE} />
    </div>
  );
}
