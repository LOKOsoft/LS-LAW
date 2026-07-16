import { PageHeader } from "@/components/shared/page-header";
import { ClientsTable } from "@/components/clients/clients-table";
import { NewClientForm } from "@/components/clients/new-client-form";
import { getClients, getRelationshipManagerOptions } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { ASSOCIATE_BASE } from "@/lib/constants/nav";

export default async function AssociateClientsPage() {
  const user = await requireUser(Role.ASSOCIATE);
  const [clients, managers] = await Promise.all([
    getClients({ scopeUserId: user.id }),
    getRelationshipManagerOptions(),
  ]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Client relationships you manage or that sit on your matters."
        actions={<NewClientForm managers={managers} />}
      />
      <ClientsTable clients={clients} basePath={ASSOCIATE_BASE} />
    </div>
  );
}
