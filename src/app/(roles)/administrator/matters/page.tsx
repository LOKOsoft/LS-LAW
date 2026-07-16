import { PageHeader } from "@/components/shared/page-header";
import { MattersTable } from "@/components/matters/matters-table";
import { NewMatterForm } from "@/components/matters/new-matter-form";
import { getMatters, getMatterFormOptions } from "@/features/matters/queries";
import { ADMINISTRATOR_BASE } from "@/lib/constants/nav";

export default async function MattersPage() {
  const [matters, options] = await Promise.all([getMatters(), getMatterFormOptions()]);

  return (
    <div>
      <PageHeader
        title="Matters"
        description="Track every matter from intake through close across all practice areas."
        actions={
          <NewMatterForm
            clients={options.clients}
            practiceAreas={options.practiceAreas}
            attorneys={options.attorneys}
            basePath={ADMINISTRATOR_BASE}
          />
        }
      />
      <MattersTable matters={matters} basePath={ADMINISTRATOR_BASE} />
    </div>
  );
}
