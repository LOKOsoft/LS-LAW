import { PageHeader } from "@/components/shared/page-header";
import { LeavesList } from "@/components/leaves/leaves-list";
import { getLeaveRequests } from "@/features/leaves/queries";

export default async function LeavesPage() {
  const requests = await getLeaveRequests();

  return (
    <div>
      <PageHeader title="Leaves" description="Leave requests and approvals across the firm." />
      <LeavesList requests={requests} />
    </div>
  );
}
