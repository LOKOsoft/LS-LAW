import { describe, expect, it } from "vitest";
import { compareDocumentVersions } from "@/features/document-generator/compare";

describe("features/document-generator/compare", () => {
  it("reports no changes for identical text", () => {
    const report = compareDocumentVersions("line one\nline two", "line one\nline two");
    expect(report.addedCount).toBe(0);
    expect(report.removedCount).toBe(0);
    expect(report.modifiedCount).toBe(0);
    expect(report.changePercentage).toBe(0);
  });

  it("detects an added line", () => {
    const report = compareDocumentVersions("line one", "line one\nline two");
    expect(report.addedCount).toBe(1);
    expect(report.ops.some((op) => op.type === "added" && op.newLine === "line two")).toBe(true);
  });

  it("detects a removed line", () => {
    const report = compareDocumentVersions("line one\nline two", "line one");
    expect(report.removedCount).toBe(1);
  });

  it("classifies a heavily-overlapping edit as modified, not add+remove", () => {
    const report = compareDocumentVersions(
      "The term of this lease shall be twelve months from the start date.",
      "The term of this lease shall be twenty four months from the start date.",
    );
    expect(report.modifiedCount).toBe(1);
    expect(report.addedCount).toBe(0);
    expect(report.removedCount).toBe(0);
  });

  it("detects a moved line (identical text relocated non-adjacently)", () => {
    const oldText = "Clause A\nClause B\nClause C";
    const newText = "Clause B\nClause C\nClause A";
    const report = compareDocumentVersions(oldText, newText);
    expect(report.movedCount).toBeGreaterThan(0);
  });
});
