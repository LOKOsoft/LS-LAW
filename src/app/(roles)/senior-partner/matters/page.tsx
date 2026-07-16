import { PageHeader } from "@/components/shared/page-header";
import { MattersTable } from "@/components/matters/matters-table";
import { NewMatterForm } from "@/components/matters/new-matter-form";
import { getMatters, getMatterFormOptions } from "@/features/matters/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { SENIOR_PARTNER_BASE } from "@/lib/constants/nav";

export default async function SeniorPartnerMattersPage() {
  const user = await requireUser(Role.SENIOR_PARTNER);
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
            basePath={SENIOR_PARTNER_BASE}
          />
        }
      />
      <MattersTable matters={matters} basePath={SENIOR_PARTNER_BASE} />
    </div>
  );
}
