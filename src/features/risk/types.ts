export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH";

export type RiskFinding = {
  ruleId: string;
  severity: RiskSeverity;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  matterId: string | null;
  detectedAt: Date;
};

/** A single configurable business rule — pure, given already-fetched data, so it's independently unit-testable without a database. */
export type RiskRule<T> = {
  id: string;
  title: string;
  severity: RiskSeverity;
  evaluate: (context: T) => RiskFinding[];
};
