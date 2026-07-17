import { describe, expect, it } from "vitest";
import { buildMatterTimeline } from "@/features/timeline/build-matter-timeline";
import type { MatterDetail } from "@/features/matters/queries";

function fakeMatter(overrides: Partial<MatterDetail>): MatterDetail {
  return {
    openedDate: new Date("2026-01-01"),
    title: "Test Matter",
    hearings: [],
    tasks: [],
    documents: [],
    invoices: [],
    notes: [],
    timeEntries: [],
    ...overrides,
  } as MatterDetail;
}

describe("features/timeline/build-matter-timeline", () => {
  it("always includes a matter-opened event", () => {
    const timeline = buildMatterTimeline(fakeMatter({}));
    expect(timeline.some((e) => e.id === "opened")).toBe(true);
  });

  it("merges hearings, documents, and invoices sorted newest-first", () => {
    const timeline = buildMatterTimeline(
      fakeMatter({
        hearings: [{ id: "h1", hearingType: "Motion", courtName: "High Court", scheduledAt: new Date("2026-03-01") } as never],
        documents: [{ id: "d1", name: "NDA.pdf", createdAt: new Date("2026-02-01") } as never],
        invoices: [{ id: "i1", invoiceNumber: "INV-1", total: 5000, issueDate: new Date("2026-04-01") } as never],
      }),
    );

    const dates = timeline.map((e) => e.date.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
    expect(timeline.some((e) => e.label === "Hearing")).toBe(true);
    expect(timeline.some((e) => e.label === "Document uploaded")).toBe(true);
    expect(timeline.some((e) => e.label === "Invoice issued" && e.description.includes("INV-1"))).toBe(true);
  });

  it("only includes completed tasks, not open ones", () => {
    const timeline = buildMatterTimeline(
      fakeMatter({
        tasks: [
          { id: "t1", title: "Done task", completedAt: new Date("2026-02-15") } as never,
          { id: "t2", title: "Open task", completedAt: null } as never,
        ],
      }),
    );
    expect(timeline.some((e) => e.description === "Done task")).toBe(true);
    expect(timeline.some((e) => e.description === "Open task")).toBe(false);
  });

  it("prepends a time-logged summary when time entries exist", () => {
    const timeline = buildMatterTimeline(
      fakeMatter({
        timeEntries: [
          { date: new Date("2026-05-01"), minutes: 60 } as never,
          { date: new Date("2026-05-02"), minutes: 30 } as never,
        ],
      }),
    );
    expect(timeline[0].id).toBe("time-summary");
    expect(timeline[0].description).toContain("2 entries");
  });
});
