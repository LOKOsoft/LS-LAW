import { describe, expect, it } from "vitest";
import {
  missingSignatureRule,
  pendingInvoiceRule,
  overdueHearingRule,
  expiredContractRule,
  overdueComplianceTaskRule,
} from "@/features/risk/rules";

describe("features/risk/rules", () => {
  it("flags a FILED document with no signedAt date", () => {
    const findings = missingSignatureRule.evaluate([
      { id: "d1", name: "Lease.pdf", status: "FILED", signedAt: null, approvedAt: new Date(), clientApprovedAt: new Date(), matterId: "m1" },
      { id: "d2", name: "NDA.pdf", status: "FILED", signedAt: new Date(), approvedAt: new Date(), clientApprovedAt: new Date(), matterId: "m1" },
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].entityId).toBe("d1");
    expect(findings[0].severity).toBe("HIGH");
  });

  it("flags an overdue invoice with an outstanding balance", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const findings = pendingInvoiceRule.evaluate([
      { id: "i1", invoiceNumber: "INV-1", status: "SENT", dueDate: yesterday, total: 1000, amountPaid: 0, matterId: "m1" },
      { id: "i2", invoiceNumber: "INV-2", status: "PAID", dueDate: yesterday, total: 1000, amountPaid: 1000, matterId: "m1" },
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].entityId).toBe("i1");
  });

  it("does not flag a fully-paid overdue invoice", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const findings = pendingInvoiceRule.evaluate([
      { id: "i3", invoiceNumber: "INV-3", status: "OVERDUE", dueDate: yesterday, total: 500, amountPaid: 500, matterId: "m1" },
    ]);
    expect(findings).toHaveLength(0);
  });

  it("flags a scheduled hearing whose date has passed", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const findings = overdueHearingRule.evaluate([
      { id: "h1", hearingType: "Motion", scheduledAt: yesterday, status: "SCHEDULED", matterId: "m1" },
      { id: "h2", hearingType: "Motion", scheduledAt: yesterday, status: "COMPLETED", matterId: "m1" },
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].entityId).toBe("h1");
  });

  it("flags an expired generated document", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const findings = expiredContractRule.evaluate([
      { id: "g1", title: "Lease — Acme", expiresAt: yesterday, matterId: "m1" },
      { id: "g2", title: "Lease — Beta", expiresAt: tomorrow, matterId: "m1" },
      { id: "g3", title: "NDA — Gamma", expiresAt: null, matterId: "m1" },
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].entityId).toBe("g1");
  });

  it("flags an overdue, incomplete task", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const findings = overdueComplianceTaskRule.evaluate([
      { id: "t1", title: "File conflict check", status: "TODO", dueDate: yesterday, matterId: "m1" },
      { id: "t2", title: "Send letter", status: "DONE", dueDate: yesterday, matterId: "m1" },
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].entityId).toBe("t1");
  });
});
