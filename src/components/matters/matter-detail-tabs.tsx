"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { AddNoteForm } from "@/components/clients/add-note-form";
import {
  HearingStatusPill,
  TaskStatusPill,
  PriorityPill,
  DocumentStatusPill,
  InvoiceStatusPill,
} from "@/components/shared/status-pill";
import { Clock, FileText, Gavel, CheckSquare, Users, StickyNote, BookOpen, Receipt as ReceiptIcon, Wallet, Activity, Pin } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime, formatTimeAgo, initials, formatMinutes } from "@/lib/format";
import type { MatterDetail } from "@/features/matters/queries";
import type { getRelatedResearch } from "@/features/matters/queries";

type ResearchArticle = Awaited<ReturnType<typeof getRelatedResearch>>[number];

export function MatterDetailTabs({
  matter,
  currentUserId,
  research,
}: {
  matter: MatterDetail;
  currentUserId: string;
  research: ResearchArticle[];
}) {
  return (
    <Tabs defaultValue="timeline" className="gap-4">
      <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="documents">Documents ({matter.documents.length})</TabsTrigger>
        <TabsTrigger value="hearings">Hearings ({matter.hearings.length})</TabsTrigger>
        <TabsTrigger value="tasks">Tasks ({matter.tasks.length})</TabsTrigger>
        <TabsTrigger value="team">Team ({matter.team.length})</TabsTrigger>
        <TabsTrigger value="notes">Notes ({matter.notes.length})</TabsTrigger>
        <TabsTrigger value="research">Research</TabsTrigger>
        <TabsTrigger value="expenses">Expenses ({matter.expenses.length})</TabsTrigger>
        <TabsTrigger value="invoices">Invoices ({matter.invoices.length})</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline">
        <MatterTimeline matter={matter} />
      </TabsContent>

      <TabsContent value="documents">
        {matter.documents.length === 0 ? (
          <EmptyState icon={FileText} title="No documents yet" description="Files for this matter will appear here." />
        ) : (
          <div className="space-y-2">
            {matter.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      v{doc.version} · {doc.uploadedBy.name} · {formatTimeAgo(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <DocumentStatusPill status={doc.status} />
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="hearings">
        {matter.hearings.length === 0 ? (
          <EmptyState icon={Gavel} title="No hearings scheduled" description="Court dates for this matter will appear here." />
        ) : (
          <div className="space-y-2">
            {matter.hearings.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{h.hearingType} — {h.courtName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {h.courtroom} · {h.judge}
                    {h.outcome ? ` · ${h.outcome}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <HearingStatusPill status={h.status} />
                  <span className="text-xs text-muted-foreground">{formatDateTime(h.scheduledAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="tasks">
        {matter.tasks.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks yet" description="Tasks assigned for this matter will appear here." />
        ) : (
          <div className="space-y-2">
            {matter.tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.assignee.name}
                    {t.dueDate ? ` · Due ${formatDate(t.dueDate)}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PriorityPill status={t.priority} />
                  <TaskStatusPill status={t.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="team">
        {matter.team.length === 0 ? (
          <EmptyState icon={Users} title="No team members assigned" />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {matter.team.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-lg border border-border/70 px-4 py-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(member.user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{member.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.user.title ?? member.user.role} · {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="notes" className="space-y-3">
        <AddNoteForm matterId={matter.id} authorId={currentUserId} />
        {matter.notes.length === 0 ? (
          <EmptyState icon={StickyNote} title="No notes yet" />
        ) : (
          <div className="space-y-2">
            {matter.notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border/70 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    {note.pinned ? <Pin className="size-3" /> : null}
                    {note.author.name}
                  </span>
                  <span>{formatTimeAgo(note.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-foreground">{note.body}</p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="research">
        {research.length === 0 ? (
          <EmptyState icon={BookOpen} title="No related research" description="Knowledge base articles related to this matter's practice area will appear here." />
        ) : (
          <div className="space-y-2">
            {research.map((article) => (
              <div key={article.id} className="rounded-lg border border-border/70 px-4 py-3">
                <p className="text-sm font-medium text-foreground">{article.title}</p>
                <p className="text-xs text-muted-foreground">{article.category} · {article.summary}</p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="expenses">
        {matter.expenses.length === 0 ? (
          <EmptyState icon={Wallet} title="No expenses logged" />
        ) : (
          <div className="space-y-2">
            {matter.expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{e.description}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {e.category} · {e.submittedBy.name} · {formatDate(e.incurredAt)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">{formatCurrency(e.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="invoices">
        {matter.invoices.length === 0 ? (
          <EmptyState icon={ReceiptIcon} title="No invoices yet" />
        ) : (
          <div className="space-y-2">
            {matter.invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">Issued {formatDate(inv.issueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(inv.total)}</span>
                  <InvoiceStatusPill status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="activity">
        {matter.activityLogs.length === 0 ? (
          <EmptyState icon={Activity} title="No activity recorded yet" />
        ) : (
          <div className="space-y-3">
            {matter.activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px]">{initials(log.actor.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{log.actor.name}</span> <span className="text-muted-foreground">{log.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function MatterTimeline({ matter }: { matter: MatterDetail }) {
  type Event = { id: string; date: Date; label: string; description: string };
  const events: Event[] = [
    { id: "opened", date: matter.openedDate, label: "Matter opened", description: matter.title },
    ...matter.hearings.map((h) => ({ id: `hearing-${h.id}`, date: h.scheduledAt, label: "Hearing", description: `${h.hearingType} — ${h.courtName}` })),
    ...matter.tasks.filter((t) => t.completedAt).map((t) => ({ id: `task-${t.id}`, date: t.completedAt as Date, label: "Task completed", description: t.title })),
    ...matter.documents.map((d) => ({ id: `doc-${d.id}`, date: d.createdAt, label: "Document uploaded", description: d.name })),
    ...matter.invoices.map((i) => ({ id: `inv-${i.id}`, date: i.issueDate, label: "Invoice issued", description: `${i.invoiceNumber} · ${formatCurrency(i.total)}` })),
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

  if (events.length === 0) {
    return <EmptyState icon={Clock} title="No activity yet" />;
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
            {i < events.length - 1 ? <span className="mt-1 w-px flex-1 bg-border" /> : null}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{event.label}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDate(event.date)}</span>
            </div>
            <p className="truncate text-sm text-muted-foreground">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
