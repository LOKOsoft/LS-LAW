import Link from "next/link";
import { Briefcase, Gavel, FileText, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MatterStatusPill } from "@/components/shared/status-pill";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { requirePortalUser } from "@/lib/auth/dal";
import { getPortalOverview } from "@/features/client-portal/queries";

export default async function ClientPortalOverviewPage() {
  const { client } = await requirePortalUser();
  const data = await getPortalOverview(client.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Welcome, {client.name}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s where things stand across your matters with the firm.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="size-4.5" />
            </div>
            <div>
              <p className="text-lg font-semibold tabular-nums text-foreground">{data.activeMatters.length}</p>
              <p className="text-xs text-muted-foreground">Active matters</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Gavel className="size-4.5" />
            </div>
            <div>
              <p className="text-lg font-semibold tabular-nums text-foreground">{data.upcomingHearings.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming hearings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <IndianRupee className="size-4.5" />
            </div>
            <div>
              <p className="text-lg font-semibold tabular-nums text-foreground">{formatCurrency(data.outstanding)}</p>
              <p className="text-xs text-muted-foreground">Outstanding balance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your matters</CardTitle>
          <CardDescription>All matters we&apos;re handling for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.matters.length === 0 ? (
            <EmptyState icon={Briefcase} title="No matters yet" />
          ) : (
            data.matters.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{m.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.matterNumber} · {m.practiceArea.name} · {m.responsibleAttorney.name}
                  </p>
                </div>
                <MatterStatusPill status={m.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming hearings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.upcomingHearings.length === 0 ? (
              <EmptyState icon={Gavel} title="No upcoming hearings" />
            ) : (
              data.upcomingHearings.map((h) => (
                <div key={h.id} className="rounded-lg border border-border/70 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{h.matter.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.courtName} · {formatDateTime(h.scheduledAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentDocuments.length === 0 ? (
              <EmptyState icon={FileText} title="No documents shared yet" />
            ) : (
              data.recentDocuments.map((d) => (
                <Link
                  key={d.id}
                  href="/client/documents"
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm text-foreground">{d.name}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
