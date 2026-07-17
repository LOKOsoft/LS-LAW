import { prisma } from "@/lib/db/prisma";
import type { RiskFinding } from "@/features/risk/types";
import {
  missingSignatureRule,
  missingApprovalRule,
  expiredContractRule,
  upcomingLimitationRule,
  pendingInvoiceRule,
  missingMandatoryDocumentsRule,
  overdueHearingRule,
  overdueComplianceTaskRule,
} from "@/features/risk/rules";

/** Runs every configured risk rule against one matter's real data — a rule-based engine, not an AI call. See docs/RISK_ENGINE.md. */
export async function getMatterRisks(matterId: string): Promise<RiskFinding[]> {
  const [documents, generatedDocuments, courtCase, invoices, matter, hearings, tasks] = await Promise.all([
    prisma.documentFile.findMany({
      where: { matterId },
      select: { id: true, name: true, status: true, signedAt: true, approvedAt: true, clientApprovedAt: true, matterId: true },
    }),
    prisma.generatedDocument.findMany({
      where: { matterId },
      select: { id: true, title: true, expiresAt: true, matterId: true },
    }),
    prisma.courtCase.findUnique({
      where: { matterId },
      select: { id: true, caseNumber: true, limitationDate: true, matterId: true },
    }),
    prisma.invoice.findMany({
      where: { matterId },
      select: { id: true, invoiceNumber: true, status: true, dueDate: true, total: true, amountPaid: true, matterId: true },
    }),
    prisma.matter.findUniqueOrThrow({
      where: { id: matterId },
      select: { id: true, title: true, openedDate: true, _count: { select: { documents: true } } },
    }),
    prisma.hearing.findMany({
      where: { matterId },
      select: { id: true, hearingType: true, scheduledAt: true, status: true, matterId: true },
    }),
    prisma.task.findMany({
      where: { matterId },
      select: { id: true, title: true, status: true, dueDate: true, matterId: true },
    }),
  ]);

  return [
    ...missingSignatureRule.evaluate(documents),
    ...missingApprovalRule.evaluate(documents),
    ...expiredContractRule.evaluate(generatedDocuments),
    ...upcomingLimitationRule.evaluate(courtCase ? [courtCase] : []),
    ...pendingInvoiceRule.evaluate(invoices),
    ...missingMandatoryDocumentsRule.evaluate([{ id: matter.id, title: matter.title, openedDate: matter.openedDate, documentCount: matter._count.documents }]),
    ...overdueHearingRule.evaluate(hearings),
    ...overdueComplianceTaskRule.evaluate(tasks),
  ].sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function severityRank(severity: RiskFinding["severity"]): number {
  return severity === "HIGH" ? 2 : severity === "MEDIUM" ? 1 : 0;
}

/** Firm-wide sweep (unscoped) — usable by a future dashboard/reports card. Not currently wired into any page; see docs/RISK_ENGINE.md's follow-up notes. */
export async function getFirmWideRisks(): Promise<RiskFinding[]> {
  const matters = await prisma.matter.findMany({ where: { status: { in: ["INTAKE", "ACTIVE", "ON_HOLD"] } }, select: { id: true } });
  const perMatter = await Promise.all(matters.map((m) => getMatterRisks(m.id)));
  return perMatter.flat().sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}
