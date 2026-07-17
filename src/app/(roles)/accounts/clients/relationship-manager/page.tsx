import { PageHeader } from "@/components/shared/page-header";
import { RelationshipManagerView } from "@/components/clients/relationship-manager-view";
import { getRelationshipManagerRoster } from "@/features/clients/queries";
import { ACCOUNTS_BASE } from "@/lib/constants/nav";

export default async function AccountsRelationshipManagerPage() {
  const groups = await getRelationshipManagerRoster();

  return (
    <div>
      <PageHeader title="Relationship Manager View" description="Active clients grouped by the partner responsible for the relationship." />
      <RelationshipManagerView groups={groups} basePath={ACCOUNTS_BASE} />
    </div>
  );
}
