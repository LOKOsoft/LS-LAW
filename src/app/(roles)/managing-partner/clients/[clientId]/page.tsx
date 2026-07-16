import { notFound } from "next/navigation";
import { ClientHeader } from "@/components/clients/client-header";
import { ClientDetailTabs } from "@/components/clients/client-detail-tabs";
import { getClientById } from "@/features/clients/queries";
import { getManagingPartner } from "@/features/firm/queries";

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const [client, currentUser] = await Promise.all([getClientById(clientId), getManagingPartner()]);

  if (!client) notFound();

  return (
    <div className="space-y-6 pb-8">
      <ClientHeader client={client} />
      <ClientDetailTabs client={client} currentUserId={currentUser.id} />
    </div>
  );
}
