import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MatterStatusPill, PriorityPill } from "@/components/shared/status-pill";
import { MatterStageControl } from "@/components/matters/matter-stage-control";
import { formatCurrencyCompact, formatDate } from "@/lib/format";
import type { MatterDetail } from "@/features/matters/queries";

export function MatterHeader({
  matter,
  basePath = "/managing-partner",
  currentUserId,
}: {
  matter: MatterDetail;
  basePath?: string;
  currentUserId: string;
}) {
  const totalBilled = matter.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const openTasks = matter.tasks.filter((t) => t.status !== "DONE").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{matter.title}</h1>
            <MatterStatusPill status={matter.status} />
            <PriorityPill status={matter.priority} />
          </div>
          <p className="text-sm text-muted-foreground">
            {matter.matterNumber} ·{" "}
            <Link href={`${basePath}/clients/${matter.client.id}`} className="underline-offset-2 hover:underline">
              {matter.client.name}
            </Link>{" "}
            ·{" "}
            <span className="inline-flex items-center gap-1.5 font-medium">
              {/* Practice area color is firm-configurable (Settings) and can't be contrast-checked at render time — shown as a decorative dot, never as text color, so label legibility never depends on which color was picked. */}
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: matter.practiceArea.color }} />
              {matter.practiceArea.name}
            </span>
          </p>
          {matter.opposingParty ? (
            <p className="text-sm text-muted-foreground">
              Opposing: {matter.opposingParty} {matter.opposingCounsel ? `(${matter.opposingCounsel})` : ""}
            </p>
          ) : null}
        </div>
      </div>

      <MatterStageControl matter={matter} currentUserId={currentUserId} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Responsible attorney</p>
            <p className="truncate text-sm font-medium text-foreground">{matter.responsibleAttorney.name}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Billing</p>
            <p className="text-sm font-medium text-foreground">
              {matter.billingType.replace("_", " ")} {matter.hourlyRate ? `· ₹${matter.hourlyRate}/hr` : ""}
            </p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Billed to date</p>
            <p className="text-sm font-semibold tabular-nums text-foreground">{formatCurrencyCompact(totalBilled)}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Opened / Open tasks</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(matter.openedDate)} · {openTasks} open
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
