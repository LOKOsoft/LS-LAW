import { PageHeader } from "@/components/shared/page-header";
import { DuplicateDetectionView } from "@/components/clients/duplicate-detection-view";
import { getDuplicateClientGroups } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { LEGAL_RESEARCHER_BASE } from "@/lib/constants/nav";

export default async function LegalResearcherDuplicateClientsPage() {
  const [groups, currentUser] = await Promise.all([getDuplicateClientGroups(), requireUser(Role.LEGAL_RESEARCHER)]);

  return (
    <div>
      <PageHeader title="Duplicate Detection" description="Clients whose name, email, or phone match another record — review and merge to keep the client base clean." />
      <DuplicateDetectionView groups={groups} currentUserId={currentUser.id} basePath={LEGAL_RESEARCHER_BASE} />
    </div>
  );
}
