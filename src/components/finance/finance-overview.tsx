"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { IndianRupee, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrencyCompact } from "@/lib/format";
import type { getFinanceOverview } from "@/features/finance/queries";

const chartConfig = { amount: { label: "Amount", color: "var(--chart-4)" } } satisfies ChartConfig;

export function FinanceOverview({ data }: { data: Awaited<ReturnType<typeof getFinanceOverview>> }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Total revenue" value={formatCurrencyCompact(data.totalRevenue)} icon={<IndianRupee />} accent="success" />
        <StatCard index={1} label="Total expenses" value={formatCurrencyCompact(data.totalExpenses)} icon={<TrendingDown />} accent="destructive" />
        <StatCard index={2} label="Net income" value={formatCurrencyCompact(data.netIncome)} icon={<TrendingUp />} accent="primary" />
        <StatCard index={3} label="Retainer balance" value={formatCurrencyCompact(data.retainerBalance)} icon={<PiggyBank />} accent="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Expenses by category</CardTitle>
            <CardDescription>All-time firm and matter expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={data.expensesByCategory} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v: number) => formatCurrencyCompact(v)} />
                <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} fontSize={12} width={140} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrencyCompact(Number(value))} />} />
                <Bar dataKey="amount" fill="var(--chart-4)" radius={[0, 6, 6, 0]} maxBarSize={22} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by practice area</CardTitle>
            <CardDescription>Estimated matter value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.revenueByPracticeArea.map((p) => (
              <div key={p.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">{formatCurrencyCompact(p.value)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
