import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatBytes, formatDate } from "@/lib/format";
import { requirePortalUser } from "@/lib/auth/dal";
import { getPortalDocuments } from "@/features/client-portal/queries";

export default async function ClientPortalDocumentsPage() {
  const { client } = await requirePortalUser();
  const documents = await getPortalDocuments(client.id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">Files the firm has shared with you.</p>
      </div>

      {documents.length === 0 ? (
        <EmptyState icon={FileText} title="No documents shared yet" description="Shared files will appear here." />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {documents.map((d) => (
              <a
                key={d.id}
                href={`/api/storage/${d.storagePath.replace(/^storage\//, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {d.matter?.title ?? "General"} · {formatBytes(d.sizeBytes)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(d.createdAt)}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
