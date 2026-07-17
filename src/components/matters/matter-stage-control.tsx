"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MatterStagePill } from "@/components/shared/status-pill";
import { advanceMatterStage, closeMatter, archiveMatter } from "@/features/matters/actions";
import { MATTER_STAGE_LABELS, MATTER_STAGE_ORDER } from "@/lib/services/workflow";
import type { MatterDetail } from "@/features/matters/queries";

type Stage = MatterDetail["stage"];

export function MatterStageControl({ matter, currentUserId }: { matter: MatterDetail; currentUserId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [closeOpen, setCloseOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);

  const stageIndex = MATTER_STAGE_ORDER.indexOf(matter.stage);
  const nextStage = stageIndex >= 0 && stageIndex < MATTER_STAGE_ORDER.length - 1 ? MATTER_STAGE_ORDER[stageIndex + 1] : null;
  const isTerminal = matter.status === "CLOSED" || matter.status === "ARCHIVED";

  async function handleAdvance() {
    if (!nextStage) return;
    setIsSubmitting(true);
    try {
      await advanceMatterStage(matter.id, nextStage as Stage, currentUserId);
      toast.success(`Matter advanced to ${MATTER_STAGE_LABELS[nextStage]}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not advance the matter stage.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleClose() {
    setIsSubmitting(true);
    try {
      await closeMatter(matter.id, currentUserId);
      toast.success("Matter closed");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not close the matter.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    setIsSubmitting(true);
    try {
      await archiveMatter(matter.id, currentUserId);
      toast.success("Matter archived");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not archive the matter.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MatterStagePill status={matter.stage} />
      {!isTerminal && nextStage ? (
        <Button size="sm" variant="outline" className="gap-1.5" disabled={isSubmitting} onClick={handleAdvance}>
          <ArrowRight className="size-3.5" />
          Advance to {MATTER_STAGE_LABELS[nextStage]}
        </Button>
      ) : null}
      {!isTerminal ? (
        <>
          <Button size="sm" variant="outline" className="gap-1.5" disabled={isSubmitting} onClick={() => setCloseOpen(true)}>
            <CheckCircle2 className="size-3.5" />
            Close matter
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" disabled={isSubmitting} onClick={() => setArchiveOpen(true)}>
            <Archive className="size-3.5" />
            Archive matter
          </Button>
        </>
      ) : null}

      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close this matter?"
        description="The matter moves to Closure and its status becomes Closed. This is blocked if there are unpaid invoices outstanding."
        confirmLabel="Close matter"
        destructive={false}
        onConfirm={handleClose}
      />
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive this matter?"
        description="The matter moves to Archive. This is blocked if there are hearings still scheduled."
        confirmLabel="Archive"
        destructive
        onConfirm={handleArchive}
      />
    </div>
  );
}
