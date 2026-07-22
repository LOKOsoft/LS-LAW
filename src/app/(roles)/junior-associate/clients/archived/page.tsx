import { PageHeader } from "@/components/shared/page-header";
import { ArchivedClientsTable } from "@/components/clients/archived-clients-table";
import { getArchivedClients } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { JUNIOR_ASSOCIATE_BASE } from "@/lib/constants/nav";

export default async function JuniorAssociateArchivedClientsPage() {
  const currentUser = await requireUser(Role.JUNIOR_ASSOCIATE);
  const clients = await getArchivedClients({ scopeUserId: currentUser.id });

  return (
    <div>
      <PageHeader title="Archived Clients" description="Clients removed from the active list. Every matter, invoice, and document stays intact and restorable." />
      <ArchivedClientsTable clients={clients} basePath={JUNIOR_ASSOCIATE_BASE} canRestore={true} />
    </div>
  );
}
