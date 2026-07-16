import { PageHeader } from "@/components/shared/page-header";
import { ClientsTable } from "@/components/clients/clients-table";
import { getClients } from "@/features/clients/queries";
import { ACCOUNTS_BASE } from "@/lib/constants/nav";

export default async function AccountsClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <PageHeader title="Clients" description="Client directory and billing history across the firm." />
      <ClientsTable clients={clients} basePath={ACCOUNTS_BASE} />
    </div>
  );
}
