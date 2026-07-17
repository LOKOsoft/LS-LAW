"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GitMerge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormModal } from "@/components/shared/form-modal";
import { mergeClients } from "@/features/clients/actions";
import type { ClientListItem } from "@/features/clients/queries";

type MergeableClient = { id: string; name: string; clientNumber: string };

export function MergeClientDialog({
  open,
  onOpenChange,
  primaryClient,
  candidates,
  currentUserId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primaryClient: MergeableClient;
  candidates: ClientListItem[];
  currentUserId: string;
  basePath?: string;
}) {
  const [duplicateId, setDuplicateId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const options = candidates.filter((c) => c.id !== primaryClient.id);

  async function handleMerge() {
    if (!duplicateId) return;
    setIsSubmitting(true);
    try {
      await mergeClients({ primaryClientId: primaryClient.id, duplicateClientId: duplicateId }, currentUserId);
      toast.success("Clients merged", {
        description: "All matters, invoices, and records were moved onto this client. The duplicate was archived.",
      });
      setDuplicateId("");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Could not merge clients. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Merge duplicate client"
      description={`Move every matter, invoice, document, and note from a duplicate record onto ${primaryClient.name}. The duplicate is archived, not deleted, so nothing is lost.`}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={isSubmitting || !duplicateId} className="gap-1.5">
            <GitMerge className="size-4" />
            {isSubmitting ? "Merging..." : "Merge into this client"}
          </Button>
        </>
      }
    >
      <div className="space-y-3 py-2">
        <p className="text-sm text-muted-foreground">
          Keeping: <span className="font-medium text-foreground">{primaryClient.name}</span> ({primaryClient.clientNumber})
        </p>
        <Select value={duplicateId} onValueChange={setDuplicateId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select the duplicate client to merge in..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.clientNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormModal>
  );
}
