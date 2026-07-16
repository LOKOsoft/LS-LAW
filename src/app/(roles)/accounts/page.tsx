import { PageHeader } from "@/components/shared/page-header";
import { BillingSummary } from "@/components/billing/billing-summary";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { getBillingSummary } from "@/features/billing/queries";
import { getRecentActivity } from "@/features/activity/queries";
import { ACCOUNTS_BASE, ACCOUNTS_MODULE_KEYS } from "@/lib/constants/nav";

export default async function AccountsDashboardPage() {
  const user = await requireUser(Role.ACCOUNTS);
  const [summary, recentActivity] = await Promise.all([getBillingSummary(), getRecentActivity(8)]);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Firm-wide billing, collections, and financial operations."
      />

      <BillingSummary summary={summary} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivityCard items={recentActivity} description="Latest billing & finance activity" />
        <QuickActionsCard basePath={ACCOUNTS_BASE} allowedKeys={ACCOUNTS_MODULE_KEYS} />
      </div>
    </div>
  );
}
