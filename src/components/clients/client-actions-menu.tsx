"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Archive, ArchiveRestore, GitMerge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MergeClientDialog } from "@/components/clients/merge-client-dialog";
import { archiveClient, restoreClient } from "@/features/clients/actions";
import type { ClientDetail, ClientListItem } from "@/features/clients/queries";

export function ClientActionsMenu({
  client,
  otherClients,
  currentUserId,
  basePath = "/managing-partner",
}: {
  client: ClientDetail;
  otherClients: ClientListItem[];
  currentUserId: string;
  basePath?: string;
}) {
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [mergeOpen, setMergeOpen] = React.useState(false);
  const router = useRouter();
  const isArchived = client.status === "ARCHIVED";

  async function handleArchiveToggle() {
    try {
      if (isArchived) {
        await restoreClient(client.id, currentUserId);
        toast.success("Client restored", { description: `${client.name} is active again.` });
      } else {
        await archiveClient(client.id, currentUserId);
        toast.success("Client archived", { description: `${client.name} moved to Archived Clients.` });
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update client status. Please try again.");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More client actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setMergeOpen(true)}>
            <GitMerge className="size-4" />
            Merge with another client...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setArchiveOpen(true)} variant={isArchived ? "default" : "destructive"}>
            {isArchived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
            {isArchived ? "Restore client" : "Archive client"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={isArchived ? "Restore this client?" : "Archive this client?"}
        description={
          isArchived
            ? "This client will move back into the active client list and become visible everywhere again."
            : "Archived clients are hidden from the main client list, but every matter, invoice, and document stays fully accessible for records retention. You can restore it anytime."
        }
        confirmLabel={isArchived ? "Restore" : "Archive"}
        destructive={!isArchived}
        onConfirm={handleArchiveToggle}
      />

      <MergeClientDialog
        open={mergeOpen}
        onOpenChange={setMergeOpen}
        primaryClient={client}
        candidates={otherClients}
        currentUserId={currentUserId}
        basePath={basePath}
      />
    </>
  );
}
