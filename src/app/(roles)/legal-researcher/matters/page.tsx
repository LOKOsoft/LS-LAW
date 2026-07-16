import { PageHeader } from "@/components/shared/page-header";
import { MattersTable } from "@/components/matters/matters-table";
import { NewMatterForm } from "@/components/matters/new-matter-form";
import { getMatters, getMatterFormOptions } from "@/features/matters/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { LEGAL_RESEARCHER_BASE } from "@/lib/constants/nav";

export default async function LegalResearcherMattersPage() {
  const user = await requireUser(Role.LEGAL_RESEARCHER);
  const [matters, options] = await Promise.all([
    getMatters({ scopeUserId: user.id }),
    getMatterFormOptions(),
  ]);

  return (
    <div>
      <PageHeader
        title="Matters"
        description="Matters you lead or are assigned to, from intake through close."
        actions={
          <NewMatterForm
            clients={options.clients}
            practiceAreas={options.practiceAreas}
            attorneys={options.attorneys}
            basePath={LEGAL_RESEARCHER_BASE}
          />
        }
      />
      <MattersTable matters={matters} basePath={LEGAL_RESEARCHER_BASE} />
    </div>
  );
}
