"use client";

import * as React from "react";
import { FileText, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GeneratedDocumentStatusPill } from "@/components/shared/status-pill";
import { GeneratedDocumentDetailSheet } from "@/components/document-generator/generated-document-detail-sheet";
import type { GeneratedDocumentListItem, GeneratedDocumentDetail } from "@/features/document-generator/queries";
import { getGeneratedDocumentDetail } from "@/features/document-generator/actions";
import { formatTimeAgo } from "@/lib/format";

export function GeneratedDocumentsList({ documents }: { documents: GeneratedDocumentListItem[] }) {
  const [selected, setSelected] = React.useState<GeneratedDocumentDetail | null>(null);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  async function openDocument(id: string) {
    setLoadingId(id);
    try {
      const detail = await getGeneratedDocumentDetail(id);
      setSelected(detail);
    } finally {
      setLoadingId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No AI-generated documents yet"
        description="Use “Generate document” above to draft a Legal Notice, NDA, agreement, or any other supported document type from structured fields."
      />
    );
  }

  return (
    <>
      <div className="space-y-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => openDocument(doc.id)}
            disabled={loadingId === doc.id}
            className="flex w-full items-center justify-between rounded-lg border border-border/70 px-4 py-3 text-left transition-colors hover:bg-muted/40 disabled:opacity-60"
          >
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  v{doc.version} · {doc.createdBy.name} · {formatTimeAgo(doc.updatedAt)}
                  {doc.matter ? ` · ${doc.matter.title}` : doc.client ? ` · ${doc.client.name}` : ""}
                </p>
              </div>
            </div>
            <GeneratedDocumentStatusPill status={doc.status} />
          </button>
        ))}
      </div>

      <GeneratedDocumentDetailSheet document={selected} open={selected !== null} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}
