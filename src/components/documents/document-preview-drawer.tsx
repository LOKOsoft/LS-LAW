"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, History, MessageSquare, Send } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DocumentStatusPill } from "@/components/shared/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatDate, formatTimeAgo, initials } from "@/lib/format";
import type { DocumentListItem } from "@/features/documents/queries";
import {
  submitDocumentForReview,
  completeDocumentReview,
  requestDocumentChanges,
  partnerApproveDocument,
  clientApproveDocument,
  fileDocument,
  addDocumentComment,
} from "@/features/documents/actions";

// pdfjs-dist touches browser-only globals (DOMMatrix) at module-evaluation time,
// which crashes SSR — must be loaded client-only.
const DocumentViewer = dynamic(
  () => import("@/components/documents/document-viewer").then((mod) => mod.DocumentViewer),
  { ssr: false, loading: () => <Skeleton className="aspect-[4/3] w-full rounded-lg" /> },
);

const WORKFLOW_ACTIONS: Record<string, { label: string; run: (id: string) => Promise<unknown> } | null> = {
  DRAFT: { label: "Submit for review", run: submitDocumentForReview },
  REVIEW: { label: "Complete review (approve)", run: completeDocumentReview },
  PARTNER_APPROVAL: { label: "Approve as partner", run: partnerApproveDocument },
  CLIENT_APPROVAL: { label: "Record client approval & signature", run: clientApproveDocument },
  SIGNED: { label: "Mark as filed", run: fileDocument },
  FILED: null,
  FINAL: null,
  ARCHIVED: null,
  SHARED: null,
};

export function DocumentPreviewDrawer({
  document,
  open,
  onOpenChange,
}: {
  document: DocumentListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [changeNote, setChangeNote] = React.useState("");
  const [showChangeNote, setShowChangeNote] = React.useState(false);

  async function runAction(action: (id: string) => Promise<unknown>) {
    if (!document) return;
    setIsSubmitting(true);
    try {
      await action(document.id);
      toast.success("Document updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the document.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRequestChanges() {
    if (!document || !changeNote.trim()) return;
    setIsSubmitting(true);
    try {
      await requestDocumentChanges(document.id, changeNote.trim());
      toast.success("Sent back for changes");
      setChangeNote("");
      setShowChangeNote(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the document back for changes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddComment() {
    if (!document || !comment.trim()) return;
    setIsSubmitting(true);
    try {
      await addDocumentComment(document.id, comment.trim());
      setComment("");
      router.refresh();
    } catch {
      toast.error("Could not post the comment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextAction = document ? WORKFLOW_ACTIONS[document.status] : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="truncate">{document?.name ?? "Document"}</SheetTitle>
          <SheetDescription>
            {document?.matter?.title ?? document?.client?.name ?? "Unfiled"}
          </SheetDescription>
        </SheetHeader>
        {document ? (
          <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
            <DocumentViewer
              fileUrl={`/api/storage/${document.storagePath.replace(/^storage\//, "")}`}
              fileType={document.fileType}
              fileName={document.name}
            />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Type" value={document.fileType} />
              <Field label="Size" value={formatBytes(document.sizeBytes)} />
              <Field label="Uploaded by" value={document.uploadedBy.name} />
              <Field label="Uploaded" value={formatDate(document.createdAt)} />
              <Field label="Status" value={<DocumentStatusPill status={document.status} />} />
              <Field label="Tags" value={document.tags?.split(",").join(", ") || "—"} />
              <Field label="Reviewed by" value={document.reviewedBy?.name ?? "—"} />
              <Field label="Approved by" value={document.approvedBy?.name ?? "—"} />
            </div>

            <div className="space-y-2 rounded-lg border border-border/70 p-3">
              <p className="text-sm font-medium text-foreground">Approval workflow</p>
              <p className="text-xs text-muted-foreground">
                Draft → Review → Partner Approval → Client Approval → Signed → Filed
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {nextAction ? (
                  <Button size="sm" disabled={isSubmitting} onClick={() => runAction(nextAction.run)}>
                    {nextAction.label}
                  </Button>
                ) : null}
                {document.status === "REVIEW" ? (
                  <Button size="sm" variant="outline" disabled={isSubmitting} onClick={() => setShowChangeNote((v) => !v)}>
                    Request changes
                  </Button>
                ) : null}
              </div>
              {showChangeNote ? (
                <div className="space-y-2 pt-1">
                  <Textarea
                    placeholder="What needs to change before this can move forward?"
                    value={changeNote}
                    onChange={(e) => setChangeNote(e.target.value)}
                  />
                  <Button size="sm" variant="outline" disabled={isSubmitting || !changeNote.trim()} onClick={handleRequestChanges}>
                    Send back to draft
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <History className="size-4" /> Version history
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                  <span className="text-foreground">Version {document.version} (current)</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(document.createdAt)}</span>
                </div>
                {document.versions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Version {v.version}</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(v.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MessageSquare className="size-4" /> Comments
              </p>
              <div className="space-y-2">
                {document.comments.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No comments yet.</p>
                ) : (
                  document.comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="text-[10px]">{initials(c.author.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm leading-snug text-foreground">{c.body}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.author.name} · {formatTimeAgo(c.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-9"
                />
                <Button size="icon" variant="outline" aria-label="Post comment" disabled={isSubmitting || !comment.trim()} onClick={handleAddComment}>
                  <Send className="size-4" />
                </Button>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full gap-1.5">
              <Link href={`/api/storage/${document.storagePath.replace(/^storage\//, "")}`} target="_blank">
                <Download className="size-4" />
                Download original file
              </Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  );
}
