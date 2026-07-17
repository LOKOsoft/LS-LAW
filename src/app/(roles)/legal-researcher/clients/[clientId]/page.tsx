import { notFound } from "next/navigation";
import { ClientHeader } from "@/components/clients/client-header";
import { ClientDetailTabs } from "@/components/clients/client-detail-tabs";
import { EditClientForm } from "@/components/clients/edit-client-form";
import { ClientActionsMenu } from "@/components/clients/client-actions-menu";
import {
  getClientById,
  getClients,
  getClientActivityLog,
  getRelationshipManagerOptions,
  isClientInScope,
} from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { LEGAL_RESEARCHER_BASE } from "@/lib/constants/nav";

export default async function LegalResearcherClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireUser(Role.LEGAL_RESEARCHER);

  const [client, inScope, activityLog, otherClients, managers] = await Promise.all([
    getClientById(clientId),
    isClientInScope(clientId, user.id),
    getClientActivityLog(clientId),
    getClients({ scopeUserId: user.id }),
    getRelationshipManagerOptions(),
  ]);
  if (!client || !inScope) notFound();

  return (
    <div className="space-y-6 pb-8">
      <ClientHeader
        client={client}
        actions={
          <>
            <EditClientForm client={client} managers={managers} currentUserId={user.id} />
            <ClientActionsMenu client={client} otherClients={otherClients} currentUserId={user.id} basePath={LEGAL_RESEARCHER_BASE} />
          </>
        }
      />
      <ClientDetailTabs client={client} currentUserId={user.id} basePath={LEGAL_RESEARCHER_BASE} activityLog={activityLog} />
    </div>
  );
}
