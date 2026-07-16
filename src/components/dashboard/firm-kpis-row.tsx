import { PercentCircle, Trophy, UserPlus, Gauge } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { formatNumber, formatPercent } from "@/lib/format";
import type { DashboardData } from "@/features/dashboard/queries";

export function FirmKpisRow({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Firm KPIs</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Collection rate"
          value={formatPercent(data.firmKpis.collectionRate)}
          icon={<PercentCircle />}
          accent="success"
          hint="Lifetime collected vs invoiced"
        />
        <StatCard
          index={1}
          label="Team utilization"
          value={formatPercent(data.utilization.average)}
          icon={<Gauge />}
          accent="primary"
          hint="Average across fee earners, this month"
        />
        <StatCard
          index={2}
          label="Matters closed"
          value={formatNumber(data.firmKpis.closedWonMatters)}
          icon={<Trophy />}
          accent="neutral"
          hint="All-time closed matters"
        />
        <StatCard
          index={3}
          label="New clients"
          value={formatNumber(data.firmKpis.newClientsThisMonth)}
          icon={<UserPlus />}
          accent="warning"
          hint="Onboarded this month"
        />
      </div>
    </div>
  );
}
