"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormModal } from "@/components/shared/form-modal";
import { updateHearing } from "@/features/hearings/actions";
import type { UpdateHearingInput } from "@/features/hearings/schema";

type HearingStatusValue = NonNullable<UpdateHearingInput["status"]>;

type HearingLike = {
  id: string;
  hearingType: string;
  courtName: string;
  scheduledAt: Date | string;
  status: string;
  outcome: string | null;
  notes: string | null;
};

function toLocalInputValue(date: Date | string) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function UpdateHearingDialog({
  hearing,
  open,
  onOpenChange,
}: {
  hearing: HearingLike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [scheduledAt, setScheduledAt] = React.useState("");
  const [status, setStatus] = React.useState<HearingStatusValue>("SCHEDULED");
  const [outcome, setOutcome] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Reset the form fields whenever a different hearing is selected — computed during render
  // rather than an effect, since the dialog stays mounted across selections.
  const [loadedHearingId, setLoadedHearingId] = React.useState<string | null>(null);
  if (hearing && hearing.id !== loadedHearingId) {
    setLoadedHearingId(hearing.id);
    setScheduledAt(toLocalInputValue(hearing.scheduledAt));
    setStatus(hearing.status as HearingStatusValue);
    setOutcome(hearing.outcome ?? "");
    setNotes(hearing.notes ?? "");
  }

  async function handleSubmit() {
    if (!hearing) return;
    setIsSubmitting(true);
    try {
      await updateHearing(hearing.id, { scheduledAt, status, outcome, notes });
      toast.success("Hearing updated");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the hearing.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={hearing ? `${hearing.hearingType} — ${hearing.courtName}` : "Update hearing"}
      description="Reschedule, change status, or record the outcome. Prep tasks and the matter timeline update automatically."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="hearing-scheduled-at">Date &amp; time</Label>
          <Input id="hearing-scheduled-at" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hearing-status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as HearingStatusValue)}>
            <SelectTrigger id="hearing-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ADJOURNED">Adjourned</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hearing-outcome">Outcome</Label>
          <Input id="hearing-outcome" placeholder="e.g. Adjourned to next date, Order reserved..." value={outcome} onChange={(e) => setOutcome(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hearing-notes">Notes</Label>
          <Textarea id="hearing-notes" placeholder="Internal notes about this hearing..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
    </FormModal>
  );
}
