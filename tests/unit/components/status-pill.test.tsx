import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  MatterStatusPill,
  TaskStatusPill,
  GeneratedDocumentStatusPill,
  RiskSeverityPill,
  StatusPill,
} from "@/components/shared/status-pill";

describe("components/shared/status-pill", () => {
  it("renders a generic StatusPill with its label", () => {
    render(<StatusPill label="Custom label" tone="success" />);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("title-cases MatterStatusPill's raw enum value", () => {
    render(<MatterStatusPill status="ON_HOLD" />);
    expect(screen.getByText("On Hold")).toBeInTheDocument();
  });

  it("renders TaskStatusPill for every real TaskStatus value without crashing", () => {
    for (const status of ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]) {
      const { unmount } = render(<TaskStatusPill status={status} />);
      unmount();
    }
  });

  it("renders GeneratedDocumentStatusPill for every real status value", () => {
    for (const status of ["DRAFT", "IN_REVIEW", "REVISION_REQUESTED", "APPROVED", "EXPORTED"]) {
      const { unmount } = render(<GeneratedDocumentStatusPill status={status} />);
      unmount();
    }
  });

  it("falls back to neutral tone for an unrecognized status instead of crashing", () => {
    render(<RiskSeverityPill status="NOT_A_REAL_SEVERITY" />);
    expect(screen.getByText("Not A Real Severity")).toBeInTheDocument();
  });
});
