import { describe, expect, it } from "vitest";
import { MatterStage, DocumentStatus } from "@/generated/prisma/enums";
import { BusinessRuleError } from "@/lib/services/errors";
import {
  nextMatterStage,
  assertValidStageTransition,
  assertValidDocumentTransition,
} from "@/lib/services/workflow";

describe("lib/services/workflow — matter stage pipeline", () => {
  it("returns the next stage in sequence", () => {
    expect(nextMatterStage(MatterStage.INQUIRY)).toBe(MatterStage.CONFLICT_CHECK);
    expect(nextMatterStage(MatterStage.DRAFTING)).toBe(MatterStage.INTERNAL_REVIEW);
  });

  it("returns null for the terminal stage", () => {
    expect(nextMatterStage(MatterStage.ARCHIVE)).toBeNull();
  });

  it("allows advancing exactly one stage", () => {
    expect(() => assertValidStageTransition(MatterStage.INQUIRY, MatterStage.CONFLICT_CHECK)).not.toThrow();
  });

  it("rejects skipping stages", () => {
    expect(() => assertValidStageTransition(MatterStage.INQUIRY, MatterStage.DRAFTING)).toThrow(BusinessRuleError);
  });

  it("rejects moving backward", () => {
    expect(() => assertValidStageTransition(MatterStage.DRAFTING, MatterStage.CONSULTATION)).toThrow(BusinessRuleError);
  });

  it("always allows jumping straight to ARCHIVE regardless of current stage", () => {
    expect(() => assertValidStageTransition(MatterStage.INQUIRY, MatterStage.ARCHIVE)).not.toThrow();
    expect(() => assertValidStageTransition(MatterStage.PAYMENT, MatterStage.ARCHIVE)).not.toThrow();
  });
});

describe("lib/services/workflow — document approval pipeline", () => {
  it("allows advancing exactly one stage", () => {
    expect(() => assertValidDocumentTransition(DocumentStatus.DRAFT, DocumentStatus.REVIEW)).not.toThrow();
    expect(() => assertValidDocumentTransition(DocumentStatus.REVIEW, DocumentStatus.PARTNER_APPROVAL)).not.toThrow();
  });

  it("rejects skipping stages", () => {
    expect(() => assertValidDocumentTransition(DocumentStatus.DRAFT, DocumentStatus.SIGNED)).toThrow(BusinessRuleError);
  });

  it("rejects transitioning from a utility status not on the linear pipeline", () => {
    expect(() => assertValidDocumentTransition(DocumentStatus.ARCHIVED, DocumentStatus.FILED)).toThrow(BusinessRuleError);
  });
});
