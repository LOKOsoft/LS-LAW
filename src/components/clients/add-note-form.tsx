"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/features/clients/actions";

export function AddNoteForm({
  clientId,
  matterId,
}: {
  clientId?: string;
  matterId?: string;
}) {
  const [body, setBody] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (body.trim().length < 2) return;
    setIsSubmitting(true);
    try {
      await createNote({ body, clientId, matterId });
      setBody("");
      toast.success("Note added");
      router.refresh();
    } catch {
      toast.error("Could not add note");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a note for the team..."
        className="min-h-20 bg-background"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={isSubmitting || body.trim().length < 2}>
          {isSubmitting ? "Saving..." : "Add note"}
        </Button>
      </div>
    </div>
  );
}
