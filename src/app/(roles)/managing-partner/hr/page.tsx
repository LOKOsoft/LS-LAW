import { PageHeader } from "@/components/shared/page-header";
import { TeamTable } from "@/components/hr/team-table";
import { getTeamMembers } from "@/features/hr/queries";

export default async function HrPage() {
  const members = await getTeamMembers();

  return (
    <div>
      <PageHeader title="HR" description="Team roster and people operations across all offices." />
      <TeamTable members={members} />
    </div>
  );
}
