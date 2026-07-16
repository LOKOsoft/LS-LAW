"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MatterStatusPill, InvoiceStatusPill, DocumentStatusPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { AddNoteForm } from "@/components/clients/add-note-form";
import { Briefcase, Receipt, FileText, Clock, Users, StickyNote, MessageSquare, Pin, Mail, Phone, MessageCircle, FileSignature } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime, formatTimeAgo } from "@/lib/format";
import type { ClientDetail } from "@/features/clients/queries";

const communicationIcon = { EMAIL: Mail, CALL: Phone, MEETING: Users, LETTER: FileSignature, SMS: MessageCircle } as const;

export function ClientDetailTabs({ client, currentUserId }: { client: ClientDetail; currentUserId: string }) {
  return (
    <Tabs defaultValue="overview" className="gap-4">
      <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="matters">Matters ({client.matters.length})</TabsTrigger>
        <TabsTrigger value="invoices">Invoices ({client.invoices.length})</TabsTrigger>
        <TabsTrigger value="documents">Documents ({client.documents.length})</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="meetings">Meetings ({client.meetings.length})</TabsTrigger>
        <TabsTrigger value="notes">Notes ({client.notes.length})</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Company name" value={client.companyName ?? client.name} />
            <InfoRow label="Client type" value={client.type === "COMPANY" ? "Company" : "Individual"} />
            <InfoRow label="Industry" value={client.industry ?? "—"} />
            <InfoRow label="Source" value={client.source ?? "—"} />
            <InfoRow label="Tax ID" value={client.taxId ?? "—"} />
            <InfoRow label="Address" value={[client.addressLine1, client.city, client.state, client.postalCode].filter(Boolean).join(", ") || "—"} />
            <InfoRow label="Relationship manager" value={client.relationshipManager?.name ?? "Unassigned"} />
            <InfoRow label="Relationship manager title" value={client.relationshipManager?.title ?? "—"} />
          </CardContent>
        </Card>
        {client.retainers.length > 0 ? (
          <Card>
            <CardContent className="space-y-3">
              <p className="text-sm font-medium text-foreground">Retainers</p>
              {client.retainers.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Started {formatDate(r.startDate)}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(r.balance)} / {formatCurrency(r.amount)} remaining
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>

      <TabsContent value="matters">
        {client.matters.length === 0 ? (
          <EmptyState icon={Briefcase} title="No matters yet" description="Matters for this client will appear here." />
        ) : (
          <div className="space-y-2">
            {client.matters.map((matter) => (
              <Link
                key={matter.id}
                href={`/managing-partner/matters/${matter.id}`}
                className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{matter.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {matter.matterNumber} · {matter.practiceArea.name} · {matter.responsibleAttorney.name}
                  </p>
                </div>
                <MatterStatusPill status={matter.status} />
              </Link>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="invoices">
        {client.invoices.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices yet" description="Invoices billed to this client will appear here." />
        ) : (
          <div className="space-y-2">
            {client.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">Issued {formatDate(invoice.issueDate)} · Due {formatDate(invoice.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(invoice.total)}</span>
                  <InvoiceStatusPill status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents">
        {client.documents.length === 0 ? (
          <EmptyState icon={FileText} title="No documents yet" description="Files shared with or generated for this client will appear here." />
        ) : (
          <div className="space-y-2">
            {client.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc.uploadedBy.name} · {formatTimeAgo(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <DocumentStatusPill status={doc.status} />
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="timeline">
        <ClientTimeline client={client} />
      </TabsContent>

      <TabsContent value="meetings">
        {client.meetings.length === 0 ? (
          <EmptyState icon={Users} title="No meetings scheduled" />
        ) : (
          <div className="space-y-2">
            {client.meetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{m.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.location} · {m.durationMinutes} min</p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{formatDateTime(m.scheduledAt)}</span>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="notes" className="space-y-3">
        <AddNoteForm clientId={client.id} authorId={currentUserId} />
        {client.notes.length === 0 ? (
          <EmptyState icon={StickyNote} title="No notes yet" description="Internal notes about this client will appear here." />
        ) : (
          <div className="space-y-2">
            {client.notes.map((note) => (
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

      <TabsContent value="communication">
        {client.communicationLogs.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No communication logged yet" />
        ) : (
          <div className="space-y-2">
            {client.communicationLogs.map((log) => {
              const Icon = communicationIcon[log.type];
              return (
                <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border/70 px-4 py-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{log.subject}</p>
                    <p className="text-xs text-muted-foreground">{log.summary}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(log.occurredAt)}</span>
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function ClientTimeline({ client }: { client: ClientDetail }) {
  type Event = { id: string; date: Date; label: string; description: string };
  const events: Event[] = [
    ...client.matters.map((m) => ({ id: `matter-${m.id}`, date: m.openedDate, label: "Matter opened", description: m.title })),
    ...client.notes.map((n) => ({ id: `note-${n.id}`, date: n.createdAt, label: "Note added", description: `${n.author.name}: ${n.body}` })),
    ...client.meetings.map((m) => ({ id: `meeting-${m.id}`, date: m.scheduledAt, label: "Meeting", description: m.title })),
    ...client.communicationLogs.map((c) => ({ id: `comm-${c.id}`, date: c.occurredAt, label: "Communication", description: c.subject })),
    ...client.invoices.map((i) => ({ id: `invoice-${i.id}`, date: i.issueDate, label: "Invoice issued", description: `${i.invoiceNumber} · ${formatCurrency(i.total)}` })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

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
