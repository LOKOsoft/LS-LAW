import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "destructive" | "primary";

const toneStyles: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  primary: "bg-primary/10 text-primary",
};

const dotStyles: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-sky-500",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  primary: "bg-primary",
};

type StatusPillProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
  withDot?: boolean;
};

export function StatusPill({ label, tone = "neutral", className, withDot = true }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        toneStyles[tone],
        className,
      )}
    >
      {withDot ? <span className={cn("size-1.5 rounded-full", dotStyles[tone])} /> : null}
      {label}
    </span>
  );
}

const MATTER_STATUS_TONE: Record<string, StatusTone> = {
  INTAKE: "info",
  ACTIVE: "success",
  ON_HOLD: "warning",
  CLOSED: "neutral",
  ARCHIVED: "neutral",
};

const TASK_STATUS_TONE: Record<string, StatusTone> = {
  TODO: "neutral",
  IN_PROGRESS: "info",
  IN_REVIEW: "warning",
  DONE: "success",
};

const HEARING_STATUS_TONE: Record<string, StatusTone> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  ADJOURNED: "warning",
  CANCELLED: "destructive",
};

const INVOICE_STATUS_TONE: Record<string, StatusTone> = {
  DRAFT: "neutral",
  SENT: "info",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERDUE: "destructive",
  VOID: "neutral",
};

const DOCUMENT_STATUS_TONE: Record<string, StatusTone> = {
  DRAFT: "neutral",
  REVIEW: "warning",
  PARTNER_APPROVAL: "warning",
  CLIENT_APPROVAL: "info",
  SIGNED: "primary",
  FILED: "success",
  FINAL: "success",
  ARCHIVED: "neutral",
  SHARED: "info",
};

const MATTER_STAGE_TONE: Record<string, StatusTone> = {
  INQUIRY: "neutral",
  CONFLICT_CHECK: "neutral",
  CONSULTATION: "info",
  MATTER_CREATED: "info",
  DOCUMENT_COLLECTION: "info",
  RESEARCH: "info",
  DRAFTING: "warning",
  INTERNAL_REVIEW: "warning",
  CLIENT_REVIEW: "warning",
  APPROVAL: "warning",
  FILING: "primary",
  COURT_HEARING: "primary",
  ORDER: "primary",
  BILLING: "success",
  PAYMENT: "success",
  CLOSURE: "neutral",
  ARCHIVE: "neutral",
};

const CLIENT_STATUS_TONE: Record<string, StatusTone> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  PROSPECT: "info",
  ARCHIVED: "neutral",
};

const PRIORITY_TONE: Record<string, StatusTone> = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "destructive",
};

const GENERATED_DOCUMENT_STATUS_TONE: Record<string, StatusTone> = {
  DRAFT: "neutral",
  IN_REVIEW: "warning",
  REVISION_REQUESTED: "destructive",
  APPROVED: "primary",
  EXPORTED: "success",
};

const RISK_SEVERITY_TONE: Record<string, StatusTone> = {
  LOW: "info",
  MEDIUM: "warning",
  HIGH: "destructive",
};

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildPill(map: Record<string, StatusTone>) {
  return function Pill({ status, className }: { status: string; className?: string }) {
    return <StatusPill label={titleCase(status)} tone={map[status] ?? "neutral"} className={className} />;
  };
}

export const MatterStatusPill = buildPill(MATTER_STATUS_TONE);
export const TaskStatusPill = buildPill(TASK_STATUS_TONE);
export const HearingStatusPill = buildPill(HEARING_STATUS_TONE);
export const InvoiceStatusPill = buildPill(INVOICE_STATUS_TONE);
export const DocumentStatusPill = buildPill(DOCUMENT_STATUS_TONE);
export const ClientStatusPill = buildPill(CLIENT_STATUS_TONE);
export const PriorityPill = buildPill(PRIORITY_TONE);
export const MatterStagePill = buildPill(MATTER_STAGE_TONE);
export const GeneratedDocumentStatusPill = buildPill(GENERATED_DOCUMENT_STATUS_TONE);
export const RiskSeverityPill = buildPill(RISK_SEVERITY_TONE);
