import { PageHeader } from "@/components/shared/page-header";
import { MattersTable } from "@/components/matters/matters-table";
import { getMatters } from "@/features/matters/queries";
import { ACCOUNTS_BASE } from "@/lib/constants/nav";

export default async function AccountsMattersPage() {
  const matters = await getMatters();

  return (
    <div>
      <PageHeader title="Matters" description="Matters across the firm, for billing and invoicing context." />
      <MattersTable matters={matters} basePath={ACCOUNTS_BASE} />
    </div>
  );
}
