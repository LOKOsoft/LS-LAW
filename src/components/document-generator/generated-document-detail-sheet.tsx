"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormDrawer } from "@/components/shared/form-drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedDocumentStatusPill } from "@/components/shared/status-pill";
import { formatDateTime } from "@/lib/format";
import type { GeneratedDocumentDetail } from "@/features/document-generator/queries";
import {
  submitGeneratedDocumentForReview,
  requestGeneratedDocumentRevision,
  approveGeneratedDocument,
  exportGeneratedDocument,
} from "@/features/document-generator/actions";
import { compareDocumentVersions, type DiffOp } from "@/features/document-generator/compare";

function DiffLine({ op }: { op: DiffOp }) {
  if (op.type === "unchanged") return <p className="px-2 py-0.5 text-muted-foreground">{op.oldLine}</p>;
  if (op.type === "added") return <p className="bg-success/10 px-2 py-0.5 text-success">+ {op.newLine}</p>;
  if (op.type === "removed") return <p className="bg-destructive/10 px-2 py-0.5 text-destructive line-through">- {op.oldLine}</p>;
  if (op.type === "modified")
    return (
      <div className="space-y-0.5 px-2 py-0.5">
        <p className="bg-destructive/10 text-destructive line-through">- {op.oldLine}</p>
        <p className="bg-success/10 text-success">+ {op.newLine}</p>
      </div>
    );
  return <p className="bg-primary/10 px-2 py-0.5 text-primary">↕ moved: {op.newLine}</p>;
}

export function GeneratedDocumentDetailSheet({
  document,
  open,
  onOpenChange,
}: {
  document: GeneratedDocumentDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [revisionNote, setRevisionNote] = React.useState("");
  const [showRevisionForm, setShowRevisionForm] = React.useState(false);
  const [compareWith, setCompareWith] = React.useState<number | null>(null);

  async function runAction(action: () => Promise<unknown>) {
    setIsSubmitting(true);
    try {
      await action();
      toast.success("Updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!document) return null;

  const comparison =
    compareWith !== null
      ? compareDocumentVersions(document.versions.find((v) => v.version === compareWith)?.content ?? "", document.content)
      : null;

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={document.title}
      description={`Version ${document.version} · ${document.matter?.title ?? document.client?.name ?? "Unfiled"}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <GeneratedDocumentStatusPill status={document.status} />
          <div className="flex flex-wrap gap-2">
            {document.status === "DRAFT" || document.status === "REVISION_REQUESTED" ? (
              <Button size="sm" disabled={isSubmitting} onClick={() => runAction(() => submitGeneratedDocumentForReview(document.id))}>
                Submit for review
              </Button>
            ) : null}
            {document.status === "IN_REVIEW" ? (
              <>
                <Button size="sm" variant="outline" disabled={isSubmitting} onClick={() => setShowRevisionForm((v) => !v)}>
                  Request revision
                </Button>
                <Button size="sm" disabled={isSubmitting} onClick={() => runAction(() => approveGeneratedDocument(document.id))}>
                  Approve
                </Button>
              </>
            ) : null}
            {document.status === "APPROVED" ? (
              <Button size="sm" disabled={isSubmitting} onClick={() => runAction(() => exportGeneratedDocument(document.id))}>
                Export to Documents
              </Button>
            ) : null}
          </div>
        </div>

        {showRevisionForm ? (
          <div className="space-y-2 rounded-lg border border-border/70 p-3">
            <Textarea placeholder="What needs to change?" value={revisionNote} onChange={(e) => setRevisionNote(e.target.value)} />
            <Button
              size="sm"
              variant="outline"
              disabled={isSubmitting || !revisionNote.trim()}
              onClick={() => {
                runAction(() => requestGeneratedDocumentRevision(document.id, revisionNote.trim()));
                setShowRevisionForm(false);
                setRevisionNote("");
              }}
            >
              Send back for revision
            </Button>
          </div>
        ) : null}

        {document.revisionNote ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <p className="font-medium">Revision requested</p>
            <p>{document.revisionNote}</p>
          </div>
        ) : null}

        <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
          <pre className="max-h-[40vh] overflow-y-auto text-xs leading-relaxed whitespace-pre-wrap text-foreground">{document.content}</pre>
        </div>

        {document.versions.length > 1 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Version history</p>
            <div className="space-y-1.5">
              {document.versions.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                  <span>
                    v{v.version} · {v.createdBy.name} · {formatDateTime(v.createdAt)}
                  </span>
                  {v.version !== document.version ? (
                    <Button size="sm" variant="ghost" onClick={() => setCompareWith(compareWith === v.version ? null : v.version)}>
                      {compareWith === v.version ? "Hide diff" : `Compare to current`}
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {comparison ? (
          <div className="space-y-2 rounded-lg border border-border/70 p-3">
            <p className="text-sm font-medium text-foreground">{comparison.summary}</p>
            <div className="max-h-[30vh] overflow-y-auto rounded-md bg-muted/20 font-mono text-xs">
              {comparison.ops.map((op, i) => (
                <DiffLine key={i} op={op} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </FormDrawer>
  );
}
