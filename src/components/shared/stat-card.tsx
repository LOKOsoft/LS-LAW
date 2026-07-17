"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: number; label?: string };
  hint?: string;
  accent?: "primary" | "success" | "warning" | "destructive" | "neutral";
  index?: number;
};

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export function StatCard({ label, value, icon, trend, hint, accent = "primary", index = 0 }: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card className="gap-0 border-border/70 py-5 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex items-start justify-between px-5">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
            {trend ? (
              <div className="flex items-center gap-1 text-xs font-medium">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
                    // Same WCAG-AA-calibrated colors as status-pill.tsx's tone styles — see that file's comment.
                    isPositive
                      ? "bg-success/10 text-[oklch(0.36_0.13_155)] dark:text-[oklch(0.86_0.13_155)]"
                      : "bg-destructive/10 text-[oklch(0.42_0.2_27)] dark:text-[oklch(0.82_0.16_25)]",
                  )}
                >
                  {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">{trend.label ?? "vs last month"}</span>
              </div>
            ) : hint ? (
              <p className="text-xs text-muted-foreground">{hint}</p>
            ) : null}
          </div>
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5", accentStyles[accent])}>
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
