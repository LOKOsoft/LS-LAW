import { PageHeader } from "@/components/shared/page-header";
import { RelationshipManagerView } from "@/components/clients/relationship-manager-view";
import { getRelationshipManagerRoster } from "@/features/clients/queries";
import { ADMINISTRATOR_BASE } from "@/lib/constants/nav";

export default async function AdministratorRelationshipManagerPage() {
  const groups = await getRelationshipManagerRoster();

  return (
    <div>
      <PageHeader title="Relationship Manager View" description="Active clients grouped by the partner responsible for the relationship." />
      <RelationshipManagerView groups={groups} basePath={ADMINISTRATOR_BASE} />
    </div>
  );
}
