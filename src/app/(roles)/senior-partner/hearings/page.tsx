import { PageHeader } from "@/components/shared/page-header";
import { HearingsTable } from "@/components/hearings/hearings-table";
import { NewHearingForm } from "@/components/hearings/new-hearing-form";
import { getHearings } from "@/features/hearings/queries";
import { matterScopeFilter } from "@/features/matters/queries";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function SeniorPartnerHearingsPage() {
  const user = await requireUser(Role.SENIOR_PARTNER);
  const [hearings, matters] = await Promise.all([
    getHearings({ scopeUserId: user.id }),
    prisma.matter.findMany({
      where: matterScopeFilter(user.id),
      select: { id: true, title: true, matterNumber: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Hearings"
        description="Court dates and hearing tracker for your matters."
        actions={<NewHearingForm matters={matters} />}
      />
      <HearingsTable hearings={hearings} />
    </div>
  );
}
