import { PageHeader } from "@/components/shared/page-header";
import { RelationshipManagerView } from "@/components/clients/relationship-manager-view";
import { getRelationshipManagerRoster } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { SENIOR_PARTNER_BASE } from "@/lib/constants/nav";

export default async function SeniorPartnerRelationshipManagerPage() {
  const currentUser = await requireUser(Role.SENIOR_PARTNER);
  const groups = await getRelationshipManagerRoster({ scopeUserId: currentUser.id });

  return (
    <div>
      <PageHeader title="Relationship Manager View" description="Your clients grouped by the partner responsible for the relationship." />
      <RelationshipManagerView groups={groups} basePath={SENIOR_PARTNER_BASE} />
    </div>
  );
}
