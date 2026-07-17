import { notFound } from "next/navigation";
import { MatterHeader } from "@/components/matters/matter-header";
import { MatterDetailTabs } from "@/components/matters/matter-detail-tabs";
import { getMatterById, getRelatedResearch, isMatterInScope } from "@/features/matters/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { JUNIOR_ASSOCIATE_BASE } from "@/lib/constants/nav";

export default async function JuniorAssociateMatterDetailPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const user = await requireUser(Role.JUNIOR_ASSOCIATE);

  const [matter, inScope] = await Promise.all([getMatterById(matterId), isMatterInScope(matterId, user.id)]);
  if (!matter || !inScope) notFound();

  const research = await getRelatedResearch(matter.practiceArea.name);

  return (
    <div className="space-y-6 pb-8">
      <MatterHeader matter={matter} basePath={JUNIOR_ASSOCIATE_BASE} currentUserId={user.id} />
      <MatterDetailTabs matter={matter} currentUserId={user.id} research={research} />
    </div>
  );
}
