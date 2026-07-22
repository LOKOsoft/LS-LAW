import { PageHeader } from "@/components/shared/page-header";
import { DuplicateDetectionView } from "@/components/clients/duplicate-detection-view";
import { getDuplicateClientGroups } from "@/features/clients/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { PARALEGAL_BASE } from "@/lib/constants/nav";

export default async function ParalegalDuplicateClientsPage() {
  const [groups] = await Promise.all([getDuplicateClientGroups(), requireUser(Role.PARALEGAL)]);

  return (
    <div>
      <PageHeader title="Duplicate Detection" description="Clients whose name, email, or phone match another record — review and merge to keep the client base clean." />
      <DuplicateDetectionView groups={groups} basePath={PARALEGAL_BASE} />
    </div>
  );
}
