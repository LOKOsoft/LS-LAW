import { notFound } from "next/navigation";
import { ClientHeader } from "@/components/clients/client-header";
import { ClientDetailTabs } from "@/components/clients/client-detail-tabs";
import { EditClientForm } from "@/components/clients/edit-client-form";
import { ClientActionsMenu } from "@/components/clients/client-actions-menu";
import { getClientById, getClients, getClientActivityLog, getRelationshipManagerOptions } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { RECEPTION_BASE } from "@/lib/constants/nav";

export default async function ReceptionClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const [client, currentUser, activityLog, otherClients, managers] = await Promise.all([
    getClientById(clientId),
    requireUser(),
    getClientActivityLog(clientId),
    getClients(),
    getRelationshipManagerOptions(),
  ]);

  if (!client) notFound();

  return (
    <div className="space-y-6 pb-8">
      <ClientHeader
        client={client}
        actions={
          <>
            <EditClientForm client={client} managers={managers} currentUserId={currentUser.id} />
            <ClientActionsMenu client={client} otherClients={otherClients} currentUserId={currentUser.id} basePath={RECEPTION_BASE} />
          </>
        }
      />
      <ClientDetailTabs client={client} currentUserId={currentUser.id} basePath={RECEPTION_BASE} activityLog={activityLog} />
    </div>
  );
}
