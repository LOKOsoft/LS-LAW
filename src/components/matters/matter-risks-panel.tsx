import { EmptyState } from "@/components/shared/empty-state";
import { RiskSeverityPill } from "@/components/shared/status-pill";
import { ShieldAlert } from "lucide-react";
import type { MatterDetail } from "@/features/matters/queries";
import {
  missingSignatureRule,
  missingApprovalRule,
  pendingInvoiceRule,
  overdueHearingRule,
  overdueComplianceTaskRule,
  missingMandatoryDocumentsRule,
} from "@/features/risk/rules";

const SEVERITY_RANK: Record<string, number> = { HIGH: 2, MEDIUM: 1, LOW: 0 };

/**
 * Runs the Risk Analysis Engine's rules against data already loaded for
 * this page (no extra fetch) — a rule-based sweep, not an AI call. Two of
 * the engine's rules (expired-contract, upcoming-limitation) need
 * generated-document/court-case data this page doesn't currently load;
 * they're still available via `getMatterRisks()`/`getFirmWideRisks()` in
 * `features/risk/queries.ts` for a future dedicated risk view. See
 * docs/RISK_ENGINE.md.
 */
export function MatterRisksPanel({ matter }: { matter: MatterDetail }) {
  const findings = [
    ...missingSignatureRule.evaluate(matter.documents),
    ...missingApprovalRule.evaluate(matter.documents),
    ...pendingInvoiceRule.evaluate(matter.invoices),
    ...overdueHearingRule.evaluate(matter.hearings),
    ...overdueComplianceTaskRule.evaluate(matter.tasks),
    ...missingMandatoryDocumentsRule.evaluate([
      { id: matter.id, title: matter.title, openedDate: matter.openedDate, documentCount: matter.documents.length },
    ]),
  ].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);

  if (findings.length === 0) {
    return <EmptyState icon={ShieldAlert} title="No risks detected" description="The configured business rules found nothing to flag on this matter." />;
  }

  return (
    <div className="space-y-2">
      {findings.map((finding, i) => (
        <div key={`${finding.ruleId}-${finding.entityId}-${i}`} className="flex items-start justify-between gap-3 rounded-lg border border-border/70 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{finding.title}</p>
            <p className="text-sm text-muted-foreground">{finding.description}</p>
          </div>
          <RiskSeverityPill status={finding.severity} className="shrink-0" />
        </div>
      ))}
    </div>
  );
}
