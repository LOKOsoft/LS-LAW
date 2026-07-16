import { notFound } from "next/navigation";
import { ClientHeader } from "@/components/clients/client-header";
import { ClientDetailTabs } from "@/components/clients/client-detail-tabs";
import { getClientById, isClientInScope } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { PARTNER_BASE } from "@/lib/constants/nav";

export default async function PartnerClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireUser(Role.PARTNER);

  const [client, inScope] = await Promise.all([getClientById(clientId), isClientInScope(clientId, user.id)]);
  if (!client || !inScope) notFound();

  return (
    <div className="space-y-6 pb-8">
      <ClientHeader client={client} />
      <ClientDetailTabs client={client} currentUserId={user.id} basePath={PARTNER_BASE} />
    </div>
  );
}
