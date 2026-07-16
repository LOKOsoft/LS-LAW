"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { IndianRupee, Receipt, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrencyCompact } from "@/lib/format";
import type { getBillingSummary } from "@/features/billing/queries";

const chartConfig = {
  billed: { label: "Billed", color: "var(--chart-1)" },
  collected: { label: "Collected", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function BillingSummary({ summary }: { summary: Awaited<ReturnType<typeof getBillingSummary>> }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Total billed" value={formatCurrencyCompact(summary.totalBilled)} icon={<IndianRupee />} accent="primary" />
        <StatCard index={1} label="Total collected" value={formatCurrencyCompact(summary.totalCollected)} icon={<TrendingUp />} accent="success" />
        <StatCard index={2} label="Outstanding" value={formatCurrencyCompact(summary.outstanding)} icon={<Receipt />} accent="warning" />
        <StatCard index={3} label="Overdue invoices" value={String(summary.overdueCount)} icon={<AlertCircle />} accent="destructive" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Billed vs collected</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={summary.trend} margin={{ top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={56} tickFormatter={(v: number) => formatCurrencyCompact(v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrencyCompact(Number(value))} />} />
              <Legend content={<ChartLegendContent />} />
              <Bar dataKey="billed" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="collected" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
