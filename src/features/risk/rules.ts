import type { RiskRule } from "@/features/risk/types";

const now = () => new Date();

// ─────────────────────────────────────────────────────────────────────────
// Each rule below is pure: given plain data (already fetched from Prisma by
// the caller, see queries.ts), it returns zero or more findings. No rule
// touches the database itself — that's what keeps them independently
// testable and keeps "the business rules" separate from "how we fetch the
// data they run against." See docs/RISK_ENGINE.md.
// ─────────────────────────────────────────────────────────────────────────

export type DocumentRiskInput = {
  id: string;
  name: string;
  status: string;
  signedAt: Date | null;
  approvedAt: Date | null;
  clientApprovedAt: Date | null;
  matterId: string | null;
};

export const missingSignatureRule: RiskRule<DocumentRiskInput[]> = {
  id: "missing-signature",
  title: "Document missing signature",
  severity: "HIGH",
  evaluate: (documents) =>
    documents
      .filter((d) => (d.status === "FILED" || d.status === "FINAL") && !d.signedAt)
      .map((d) => ({
        ruleId: "missing-signature",
        severity: "HIGH",
        title: "Filed document has no recorded signature",
        description: `"${d.name}" is marked ${d.status} but has no signedAt date recorded.`,
        entityType: "DOCUMENT",
        entityId: d.id,
        matterId: d.matterId,
        detectedAt: now(),
      })),
};

export const missingApprovalRule: RiskRule<DocumentRiskInput[]> = {
  id: "missing-approval",
  title: "Document missing approval",
  severity: "MEDIUM",
  evaluate: (documents) =>
    documents
      .filter((d) => d.status === "CLIENT_APPROVAL" && !d.approvedAt)
      .map((d) => ({
        ruleId: "missing-approval",
        severity: "MEDIUM",
        title: "Document awaiting client approval has no partner approval on record",
        description: `"${d.name}" is at Client Approval stage but was never marked partner-approved.`,
        entityType: "DOCUMENT",
        entityId: d.id,
        matterId: d.matterId,
        detectedAt: now(),
      })),
};

export type GeneratedDocumentRiskInput = { id: string; title: string; expiresAt: Date | null; matterId: string | null };

export const expiredContractRule: RiskRule<GeneratedDocumentRiskInput[]> = {
  id: "expired-contract",
  title: "Expired contract",
  severity: "HIGH",
  evaluate: (documents) =>
    documents
      .filter((d) => d.expiresAt !== null && d.expiresAt < now())
      .map((d) => ({
        ruleId: "expired-contract",
        severity: "HIGH",
        title: "Contract has expired",
        description: `"${d.title}" expired on ${d.expiresAt!.toDateString()}.`,
        entityType: "GENERATED_DOCUMENT",
        entityId: d.id,
        matterId: d.matterId,
        detectedAt: now(),
      })),
};

const LIMITATION_WARNING_WINDOW_DAYS = 60;

export type CourtCaseRiskInput = { id: string; caseNumber: string; limitationDate: Date | null; matterId: string };

export const upcomingLimitationRule: RiskRule<CourtCaseRiskInput[]> = {
  id: "upcoming-limitation",
  title: "Upcoming limitation period",
  severity: "HIGH",
  evaluate: (cases) => {
    const warningThreshold = new Date(now().getTime() + LIMITATION_WARNING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    return cases
      .filter((c) => c.limitationDate !== null && c.limitationDate <= warningThreshold)
      .map((c) => ({
        ruleId: "upcoming-limitation",
        severity: c.limitationDate! < now() ? "HIGH" : "MEDIUM",
        title: c.limitationDate! < now() ? "Limitation period has passed" : "Limitation period approaching",
        description: `Case ${c.caseNumber}'s limitation date is ${c.limitationDate!.toDateString()}.`,
        entityType: "COURT_CASE",
        entityId: c.id,
        matterId: c.matterId,
        detectedAt: now(),
      }));
  },
};

export type InvoiceRiskInput = { id: string; invoiceNumber: string; status: string; dueDate: Date; total: number; amountPaid: number; matterId: string | null };

export const pendingInvoiceRule: RiskRule<InvoiceRiskInput[]> = {
  id: "pending-invoice",
  title: "Overdue invoice",
  severity: "MEDIUM",
  evaluate: (invoices) =>
    invoices
      .filter((i) => ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(i.status) && i.dueDate < now() && i.amountPaid < i.total)
      .map((i) => ({
        ruleId: "pending-invoice",
        severity: "MEDIUM",
        title: "Invoice is overdue",
        description: `Invoice ${i.invoiceNumber} was due ${i.dueDate.toDateString()} with ${i.total - i.amountPaid} still outstanding.`,
        entityType: "INVOICE",
        entityId: i.id,
        matterId: i.matterId,
        detectedAt: now(),
      })),
};

export type MatterDocumentCountInput = { id: string; title: string; openedDate: Date; documentCount: number };

const MISSING_DOCUMENTS_GRACE_DAYS = 14;

export const missingMandatoryDocumentsRule: RiskRule<MatterDocumentCountInput[]> = {
  id: "missing-mandatory-documents",
  title: "Missing mandatory documents",
  severity: "MEDIUM",
  evaluate: (matters) => {
    const graceThreshold = new Date(now().getTime() - MISSING_DOCUMENTS_GRACE_DAYS * 24 * 60 * 60 * 1000);
    return matters
      .filter((m) => m.documentCount === 0 && m.openedDate < graceThreshold)
      .map((m) => ({
        ruleId: "missing-mandatory-documents",
        severity: "MEDIUM",
        title: "Matter has no documents on file",
        description: `"${m.title}" was opened over ${MISSING_DOCUMENTS_GRACE_DAYS} days ago and still has zero documents filed.`,
        entityType: "MATTER",
        entityId: m.id,
        matterId: m.id,
        detectedAt: now(),
      }));
  },
};

export type HearingRiskInput = { id: string; hearingType: string; scheduledAt: Date; status: string; matterId: string };

export const overdueHearingRule: RiskRule<HearingRiskInput[]> = {
  id: "overdue-hearing",
  title: "Overdue hearing",
  severity: "HIGH",
  evaluate: (hearings) =>
    hearings
      .filter((h) => h.status === "SCHEDULED" && h.scheduledAt < now())
      .map((h) => ({
        ruleId: "overdue-hearing",
        severity: "HIGH",
        title: "Hearing date has passed without an outcome recorded",
        description: `${h.hearingType} hearing scheduled for ${h.scheduledAt.toDateString()} is still marked Scheduled.`,
        entityType: "HEARING",
        entityId: h.id,
        matterId: h.matterId,
        detectedAt: now(),
      })),
};

export type TaskRiskInput = { id: string; title: string; status: string; dueDate: Date | null; matterId: string | null };

/**
 * Stands in for "overdue compliance activities" — this app has no dedicated
 * compliance-task model, so the rule flags overdue tasks generally (compliance
 * checklist items like conflict checks are seeded as ordinary Tasks — see
 * `lib/services/task-templates.ts`). A dedicated Compliance model would be
 * the real enhancement path if this becomes its own feature.
 */
export const overdueComplianceTaskRule: RiskRule<TaskRiskInput[]> = {
  id: "overdue-compliance-task",
  title: "Overdue task",
  severity: "LOW",
  evaluate: (tasks) =>
    tasks
      .filter((t) => t.status !== "DONE" && t.dueDate !== null && t.dueDate < now())
      .map((t) => ({
        ruleId: "overdue-compliance-task",
        severity: "LOW",
        title: "Task is overdue",
        description: `"${t.title}" was due ${t.dueDate!.toDateString()} and is still ${t.status}.`,
        entityType: "TASK",
        entityId: t.id,
        matterId: t.matterId,
        detectedAt: now(),
      })),
};

export const ALL_RISK_RULES = [
  missingSignatureRule,
  missingApprovalRule,
  expiredContractRule,
  upcomingLimitationRule,
  pendingInvoiceRule,
  missingMandatoryDocumentsRule,
  overdueHearingRule,
  overdueComplianceTaskRule,
];
