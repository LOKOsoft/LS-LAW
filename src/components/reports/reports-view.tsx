"use client";

import type * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrencyCompact, formatPercent } from "@/lib/format";
import type { getReportsData } from "@/features/reports/queries";

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig;
const growthConfig = { growth: { label: "Growth", color: "var(--chart-2)" } } satisfies ChartConfig;
const statusConfig = { count: { label: "Matters", color: "var(--chart-1)" } } satisfies ChartConfig;
const performanceConfig = { value: { label: "Estimated value", color: "var(--chart-5)" } } satisfies ChartConfig;

export function ReportsView({ data }: { data: Awaited<ReturnType<typeof getReportsData>> }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue — 12 month trend</CardTitle>
          <CardDescription>Collections across the trailing year</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-64 w-full">
            <AreaChart data={data.revenueTrend} margin={{ left: -12, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="reportsRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={56} tickFormatter={(v: number) => formatCurrencyCompact(v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrencyCompact(Number(value))} />} />
              <Area dataKey="revenue" type="monotone" stroke="var(--chart-1)" strokeWidth={2} fill="url(#reportsRevenueFill)" dot={false} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly growth</CardTitle>
            <CardDescription>Month-over-month revenue change</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={growthConfig} className="h-56 w-full">
              <BarChart data={data.monthlyGrowth} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={52} tickFormatter={(v: number) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatPercent(Number(value))} />} />
                <Bar dataKey="growth" radius={[6, 6, 6, 6]} maxBarSize={28}>
                  {data.monthlyGrowth.map((entry) => (
                    <Cell key={entry.month} fill={entry.growth >= 0 ? "var(--success)" : "var(--destructive)"} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matter status</CardTitle>
            <CardDescription>Distribution across the matter lifecycle</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig} className="h-56 w-full">
              <BarChart data={data.matterStatus} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={32} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Practice areas</CardTitle>
            <CardDescription>Share of active matters</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-56 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={data.practiceAreaDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" strokeWidth={2} stroke="var(--card)">
                  {data.practiceAreaDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lawyer performance</CardTitle>
            <CardDescription>Estimated matter value by responsible attorney</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={performanceConfig} className="h-56 w-full">
              <BarChart data={data.lawyerPerformance} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v: number) => formatCurrencyCompact(v)} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={100} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrencyCompact(Number(value))} />} />
                <Bar dataKey="value" fill="var(--chart-5)" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  <LabelList dataKey="hours" position="right" formatter={(v: React.ReactNode) => `${v}h`} fontSize={11} fill="var(--muted-foreground)" />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
