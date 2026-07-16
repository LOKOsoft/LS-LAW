import { IndianRupee, Receipt, Briefcase, Gavel } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import type { DashboardData } from "@/features/dashboard/queries";

export function KpiRow({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        index={0}
        label="Revenue this month"
        value={formatCurrencyCompact(data.revenueThisMonth)}
        icon={<IndianRupee />}
        accent="success"
        trend={{ value: data.revenueTrendPct }}
      />
      <StatCard
        index={1}
        label="Pending bills"
        value={formatCurrencyCompact(data.pendingBills.outstanding)}
        icon={<Receipt />}
        accent="warning"
        hint={`${data.pendingBills.count} invoices · ${data.pendingBills.overdueCount} overdue`}
      />
      <StatCard
        index={2}
        label="Open matters"
        value={formatNumber(data.matterCounts.open)}
        icon={<Briefcase />}
        accent="primary"
        hint="Intake, active & on hold"
      />
      <StatCard
        index={3}
        label="Today's hearings"
        value={formatNumber(data.todaysHearings.length)}
        icon={<Gavel />}
        accent="neutral"
        hint={data.todaysHearings.length > 0 ? data.todaysHearings[0].courtName : "No hearings scheduled today"}
      />
    </div>
  );
}
