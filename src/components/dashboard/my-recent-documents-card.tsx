import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DocumentStatusPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { formatBytes, formatTimeAgo } from "@/lib/format";
import type { DocumentListItem } from "@/features/documents/queries";

export function MyRecentDocumentsCard({
  documents,
  basePath = "/managing-partner",
}: {
  documents: DocumentListItem[];
  basePath?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My recent documents</CardTitle>
        <CardDescription>Latest uploads on your matters</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <EmptyState icon={FileText} title="No documents yet" description="Documents on your matters will appear here." />
        ) : (
          <div className="space-y-1">
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={doc.matter ? `${basePath}/matters/${doc.matter.id}` : `${basePath}/documents`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {doc.matter?.title ?? "Unfiled"} · {formatBytes(doc.sizeBytes)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <DocumentStatusPill status={doc.status} />
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(doc.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
