import { formatCurrency, formatMinutes } from "@/lib/format";
import type { MatterDetail } from "@/features/matters/queries";

export type TimelineEvent = {
  id: string;
  date: Date;
  label: string;
  description: string;
};

/**
 * Smart Timeline (Step 10): merges every source of matter history — opening,
 * hearings, completed tasks, documents, invoices, notes, and logged time —
 * into one chronological feed. Pure and framework-agnostic (no Prisma calls
 * of its own) so it can run in a Client Component directly against data the
 * page already fetched via `getMatterById`, with no extra round-trip. See
 * docs/RISK_ENGINE.md's sibling doc, docs/AI_ARCHITECTURE.md, for how this
 * relates to the rest of the AI-adjacent layer, and
 * `components/matters/matter-detail-tabs.tsx` for where it's rendered.
 */
export function buildMatterTimeline(matter: MatterDetail): TimelineEvent[] {
  const events: TimelineEvent[] = [
    { id: "opened", date: matter.openedDate, label: "Matter opened", description: matter.title },
    ...matter.hearings.map((h) => ({
      id: `hearing-${h.id}`,
      date: h.scheduledAt,
      label: "Hearing",
      description: `${h.hearingType} — ${h.courtName}`,
    })),
    ...matter.tasks
      .filter((t) => t.completedAt)
      .map((t) => ({ id: `task-${t.id}`, date: t.completedAt as Date, label: "Task completed", description: t.title })),
    ...matter.documents.map((d) => ({ id: `doc-${d.id}`, date: d.createdAt, label: "Document uploaded", description: d.name })),
    ...matter.invoices.map((i) => ({
      id: `inv-${i.id}`,
      date: i.issueDate,
      label: "Invoice issued",
      description: `${i.invoiceNumber} · ${formatCurrency(i.total)}`,
    })),
    ...matter.notes.map((n) => ({ id: `note-${n.id}`, date: n.createdAt, label: "Note added", description: n.body })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (matter.timeEntries.length > 0) {
    const totalMinutes = matter.timeEntries.reduce((sum, t) => sum + t.minutes, 0);
    events.unshift({
      id: "time-summary",
      date: matter.timeEntries[0].date,
      label: "Time logged",
      description: `${formatMinutes(totalMinutes)} logged across ${matter.timeEntries.length} entries`,
    });
  }

  return events;
}
