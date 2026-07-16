import { PageHeader } from "@/components/shared/page-header";
import { ClientsTable } from "@/components/clients/clients-table";
import { NewClientForm } from "@/components/clients/new-client-form";
import { getClients, getRelationshipManagerOptions } from "@/features/clients/queries";

export default async function ClientsPage() {
  const [clients, managers] = await Promise.all([getClients(), getRelationshipManagerOptions()]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage client relationships, matters, and billing history across the firm."
        actions={<NewClientForm managers={managers} />}
      />
      <ClientsTable clients={clients} />
    </div>
  );
}
