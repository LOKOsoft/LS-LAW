import { notFound } from "next/navigation";
import { ClientHeader } from "@/components/clients/client-header";
import { ClientDetailTabs } from "@/components/clients/client-detail-tabs";
import { getClientById } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { ADMINISTRATOR_BASE } from "@/lib/constants/nav";

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const [client, currentUser] = await Promise.all([getClientById(clientId), requireUser()]);

  if (!client) notFound();

  return (
    <div className="space-y-6 pb-8">
      <ClientHeader client={client} />
      <ClientDetailTabs client={client} currentUserId={currentUser.id} basePath={ADMINISTRATOR_BASE} />
    </div>
  );
}
