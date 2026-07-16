import { PageHeader } from "@/components/shared/page-header";
import { HearingsTable } from "@/components/hearings/hearings-table";
import { NewHearingForm } from "@/components/hearings/new-hearing-form";
import { getHearings } from "@/features/hearings/queries";
import { prisma } from "@/lib/db/prisma";

export default async function HearingsPage() {
  const [hearings, matters] = await Promise.all([
    getHearings(),
    prisma.matter.findMany({ select: { id: true, title: true, matterNumber: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Hearings"
        description="Court dates and hearing tracker across all matters."
        actions={<NewHearingForm matters={matters} />}
      />
      <HearingsTable hearings={hearings} />
    </div>
  );
}
