"use client";

import * as React from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatusPill } from "@/components/shared/status-pill";
import { formatDate } from "@/lib/format";
import type { MatterDetail } from "@/features/matters/queries";
import { generateMatterSummary, generateMeetingBrief } from "@/features/matter-assistant/actions";

/**
 * The Matter Assistant (Step 7 of the AI-first platform). Pending tasks and
 * upcoming deadlines are computed directly from data this page already
 * loaded — no extra fetch. "Summarize" and "Generate meeting brief" are the
 * two capabilities that need actual narrative text, so those go through a
 * Server Action into the real `AIPipeline` (see
 * `features/matter-assistant/actions.ts`) — currently answered by
 * `MockAIProvider`'s deterministic canned text until a real local/cloud
 * provider is configured. See docs/AI_ARCHITECTURE.md.
 */
export function MatterAssistantPanel({ matter }: { matter: MatterDetail }) {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [brief, setBrief] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<"summary" | "brief" | null>(null);

  const pendingTasks = matter.tasks.filter((t) => t.status !== "DONE");
  const deadlines = [
    ...pendingTasks.filter((t) => t.dueDate).map((t) => ({ label: t.title, date: t.dueDate as Date })),
    ...matter.hearings.filter((h) => h.status === "SCHEDULED").map((h) => ({ label: `${h.hearingType} — ${h.courtName}`, date: h.scheduledAt })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  async function handleSummarize() {
    setLoading("summary");
    try {
      setSummary(await generateMatterSummary(matter.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate a summary.");
    } finally {
      setLoading(null);
    }
  }

  async function handleMeetingBrief() {
    setLoading("brief");
    try {
      const openItems = pendingTasks.map((t) => `Task: ${t.title}`);
      setBrief(await generateMeetingBrief(matter.id, openItems));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate a meeting brief.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="gap-1.5" disabled={loading !== null} onClick={handleSummarize}>
          <Sparkles className="size-4" />
          {loading === "summary" ? "Summarizing..." : "Summarize matter"}
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" disabled={loading !== null} onClick={handleMeetingBrief}>
          <Sparkles className="size-4" />
          {loading === "brief" ? "Generating..." : "Generate meeting brief"}
        </Button>
      </div>

      {summary ? (
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-sm text-foreground">{summary}</div>
      ) : null}
      {brief ? (
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-sm whitespace-pre-wrap text-foreground">{brief}</div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Pending tasks ({pendingTasks.length})</p>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing outstanding.</p>
        ) : (
          <div className="space-y-1.5">
            {pendingTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                <span>{t.title}</span>
                <TaskStatusPill status={t.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Upcoming deadlines</p>
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming deadlines detected.</p>
        ) : (
          <div className="space-y-1.5">
            {deadlines.map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                <span>{d.label}</span>
                <span className="text-muted-foreground">{formatDate(d.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
