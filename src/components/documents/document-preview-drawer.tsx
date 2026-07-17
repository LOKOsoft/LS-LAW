"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Download, History } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DocumentStatusPill } from "@/components/shared/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatDate, formatTimeAgo } from "@/lib/format";
import type { DocumentListItem } from "@/features/documents/queries";

// pdfjs-dist touches browser-only globals (DOMMatrix) at module-evaluation time,
// which crashes SSR — must be loaded client-only.
const DocumentViewer = dynamic(
  () => import("@/components/documents/document-viewer").then((mod) => mod.DocumentViewer),
  { ssr: false, loading: () => <Skeleton className="aspect-[4/3] w-full rounded-lg" /> },
);

export function DocumentPreviewDrawer({
  document,
  open,
  onOpenChange,
}: {
  document: DocumentListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
