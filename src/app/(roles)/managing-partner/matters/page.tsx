import { PageHeader } from "@/components/shared/page-header";
import { MattersTable } from "@/components/matters/matters-table";
import { NewMatterForm } from "@/components/matters/new-matter-form";
import { getMatters, getMatterFormOptions } from "@/features/matters/queries";

export default async function MattersPage() {
  const [matters, options] = await Promise.all([getMatters(), getMatterFormOptions()]);

  return (
    <div>
      <PageHeader
        title="Matters"
        description="Track every matter from intake through close across all practice areas."
        actions={
          <NewMatterForm clients={options.clients} practiceAreas={options.practiceAreas} attorneys={options.attorneys} />
        }
      />
      <MattersTable matters={matters} />
    </div>
  );
}
