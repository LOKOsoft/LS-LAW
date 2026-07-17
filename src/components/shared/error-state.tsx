import * as React from "react";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/** Same shape as EmptyState, for genuine failures (failed load, request error) rather than "no data yet". */
export function ErrorState({
  icon: Icon = AlertTriangle,
  title = "Something went wrong",
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="size-6 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
