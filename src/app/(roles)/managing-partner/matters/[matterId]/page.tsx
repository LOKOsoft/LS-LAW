import { notFound } from "next/navigation";
import { MatterHeader } from "@/components/matters/matter-header";
import { MatterDetailTabs } from "@/components/matters/matter-detail-tabs";
import { getMatterById, getRelatedResearch } from "@/features/matters/queries";
import { requireUser } from "@/lib/auth/dal";

export default async function MatterDetailPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const matter = await getMatterById(matterId);
  if (!matter) notFound();

  const [, research] = await Promise.all([
    requireUser(),
    getRelatedResearch(matter.practiceArea.name),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <MatterHeader matter={matter} />
      <MatterDetailTabs matter={matter} research={research} />
    </div>
  );
}
