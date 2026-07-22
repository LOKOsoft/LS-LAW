import { notFound } from "next/navigation";
import { MatterHeader } from "@/components/matters/matter-header";
import { MatterDetailTabs } from "@/components/matters/matter-detail-tabs";
import { getMatterById, getRelatedResearch, isMatterInScope } from "@/features/matters/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { LEGAL_RESEARCHER_BASE } from "@/lib/constants/nav";

export default async function LegalResearcherMatterDetailPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const user = await requireUser(Role.LEGAL_RESEARCHER);

  const [matter, inScope] = await Promise.all([getMatterById(matterId), isMatterInScope(matterId, user.id)]);
  if (!matter || !inScope) notFound();

  const research = await getRelatedResearch(matter.practiceArea.name);

  return (
    <div className="space-y-6 pb-8">
      <MatterHeader matter={matter} basePath={LEGAL_RESEARCHER_BASE} />
      <MatterDetailTabs matter={matter} research={research} />
    </div>
  );
}
