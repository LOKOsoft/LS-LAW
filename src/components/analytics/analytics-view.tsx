"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrencyCompact } from "@/lib/format";
import type { AnalyticsData } from "@/features/analytics/queries";

type ViewKey = keyof AnalyticsData;

const VIEWS: { key: ViewKey; label: string; isCurrency: boolean }[] = [
  { key: "revenueByPracticeArea", label: "Estimated value by practice area", isCurrency: true },
  { key: "mattersByAttorney", label: "Matter count by attorney", isCurrency: false },
  { key: "hoursByAttorney", label: "Billable hours by attorney", isCurrency: false },
  { key: "expensesByCategory", label: "Expenses by category", isCurrency: true },
];

const chartConfig = { value: { label: "Value", color: "var(--chart-1)" } } satisfies ChartConfig;

export function AnalyticsView({ data }: { data: AnalyticsData }) {
  const [view, setView] = React.useState<ViewKey>("revenueByPracticeArea");
  const current = VIEWS.find((v) => v.key === view)!;
  const chartData = data[view];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Custom analytics view</CardTitle>
          <CardDescription>Pick a dimension to build your own breakdown</CardDescription>
        </div>
        <Select value={view} onValueChange={(v) => setView(v as ViewKey)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VIEWS.map((v) => (
              <SelectItem key={v.key} value={v.key}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart data={chartData} margin={{ top: 16 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              width={56}
              tickFormatter={(v: number) => (current.isCurrency ? formatCurrencyCompact(v) : String(v))}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => (current.isCurrency ? formatCurrencyCompact(Number(value)) : String(value))} />} />
            <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={56}>
              <LabelList
                dataKey="value"
                position="top"
                fontSize={11}
                fill="var(--muted-foreground)"
                formatter={(v: React.ReactNode) => (current.isCurrency ? formatCurrencyCompact(Number(v)) : String(v))}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
