import { MatterStage, DocumentStatus } from "@/generated/prisma/enums";
import { BusinessRuleError } from "@/lib/services/errors";

/** Canonical order of the matter pipeline: Inquiry → Archive. */
export const MATTER_STAGE_ORDER: MatterStage[] = [
  MatterStage.INQUIRY,
  MatterStage.CONFLICT_CHECK,
  MatterStage.CONSULTATION,
  MatterStage.MATTER_CREATED,
  MatterStage.DOCUMENT_COLLECTION,
  MatterStage.RESEARCH,
  MatterStage.DRAFTING,
  MatterStage.INTERNAL_REVIEW,
  MatterStage.CLIENT_REVIEW,
  MatterStage.APPROVAL,
  MatterStage.FILING,
  MatterStage.COURT_HEARING,
  MatterStage.ORDER,
  MatterStage.BILLING,
  MatterStage.PAYMENT,
  MatterStage.CLOSURE,
  MatterStage.ARCHIVE,
];

export const MATTER_STAGE_LABELS: Record<MatterStage, string> = {
  INQUIRY: "Client Inquiry",
  CONFLICT_CHECK: "Conflict Check",
  CONSULTATION: "Consultation",
  MATTER_CREATED: "Matter Created",
  DOCUMENT_COLLECTION: "Document Collection",
  RESEARCH: "Research",
  DRAFTING: "Drafting",
  INTERNAL_REVIEW: "Internal Review",
  CLIENT_REVIEW: "Client Review",
  APPROVAL: "Approval",
  FILING: "Filing",
  COURT_HEARING: "Court Hearing",
  ORDER: "Order",
  BILLING: "Billing",
  PAYMENT: "Payment",
  CLOSURE: "Matter Closure",
  ARCHIVE: "Archive",
};

export function nextMatterStage(current: MatterStage): MatterStage | null {
  const index = MATTER_STAGE_ORDER.indexOf(current);
  if (index === -1 || index === MATTER_STAGE_ORDER.length - 1) return null;
  return MATTER_STAGE_ORDER[index + 1];
}

/** Stages may only move forward one step at a time, or jump straight to ARCHIVE (a matter can be shelved at any point). */
export function assertValidStageTransition(current: MatterStage, target: MatterStage) {
  if (target === MatterStage.ARCHIVE) return;
  const currentIndex = MATTER_STAGE_ORDER.indexOf(current);
  const targetIndex = MATTER_STAGE_ORDER.indexOf(target);
  if (targetIndex !== currentIndex + 1) {
    throw new BusinessRuleError(
      `Cannot move a matter from "${MATTER_STAGE_LABELS[current]}" to "${MATTER_STAGE_LABELS[target]}" — stages advance one step at a time.`,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Document approval pipeline: Draft → Review → Partner Approval → Client
// Approval → Signed → Filed. ARCHIVED/SHARED/FINAL remain reachable as
// independent utility statuses via their existing toggles.
// ─────────────────────────────────────────────────────────────────────────

export const DOCUMENT_STAGE_ORDER: DocumentStatus[] = [
  DocumentStatus.DRAFT,
  DocumentStatus.REVIEW,
  DocumentStatus.PARTNER_APPROVAL,
  DocumentStatus.CLIENT_APPROVAL,
  DocumentStatus.SIGNED,
  DocumentStatus.FILED,
];

export const DOCUMENT_STAGE_LABELS: Record<DocumentStatus, string> = {
  DRAFT: "Draft",
  REVIEW: "Review",
  PARTNER_APPROVAL: "Partner Approval",
  CLIENT_APPROVAL: "Client Approval",
  SIGNED: "Signed",
  FILED: "Filed",
  FINAL: "Final",
  ARCHIVED: "Archived",
  SHARED: "Shared",
};

export function assertValidDocumentTransition(current: DocumentStatus, target: DocumentStatus) {
  const currentIndex = DOCUMENT_STAGE_ORDER.indexOf(current);
  const targetIndex = DOCUMENT_STAGE_ORDER.indexOf(target);
  if (currentIndex === -1 || targetIndex !== currentIndex + 1) {
    throw new BusinessRuleError(
      `Cannot move a document from "${DOCUMENT_STAGE_LABELS[current]}" to "${DOCUMENT_STAGE_LABELS[target]}" — the approval pipeline advances one step at a time.`,
    );
  }
}
