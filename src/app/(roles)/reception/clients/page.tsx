import { PageHeader } from "@/components/shared/page-header";
import { ClientsTable } from "@/components/clients/clients-table";
import { NewClientForm } from "@/components/clients/new-client-form";
import { getClients, getRelationshipManagerOptions } from "@/features/clients/queries";
import { RECEPTION_BASE } from "@/lib/constants/nav";

export default async function ReceptionClientsPage() {
  const [clients, managers] = await Promise.all([getClients(), getRelationshipManagerOptions()]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Client intake and directory across the firm."
        actions={<NewClientForm managers={managers} />}
      />
      <ClientsTable clients={clients} basePath={RECEPTION_BASE} />
    </div>
  );
}
