import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DocumentStatusPill } from "@/components/shared/status-pill";
import { formatBytes, formatTimeAgo } from "@/lib/format";

type RecentUpload = {
  id: string;
  name: string;
  fileType: string;
  sizeBytes: number;
  createdAt: Date;
  status: string;
  matter: { title: string } | null;
  uploadedBy: { name: string };
};

export function DocumentStatusCard({
  breakdown,
  recentUploads,
  basePath = "/managing-partner",
}: {
  breakdown: { status: string; count: number }[];
  recentUploads: RecentUpload[];
  basePath?: string;
}) {
  const total = Math.max(1, breakdown.reduce((sum, b) => sum + b.count, 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document vault</CardTitle>
        <CardDescription>Status breakdown &amp; recent uploads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {breakdown.map((b) => (
            <div key={b.status} className="rounded-lg border border-border/70 px-3 py-2 text-center">
              <p className="text-lg font-semibold tabular-nums text-foreground">{b.count}</p>
              <p className="text-xs text-muted-foreground">{b.status}</p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(b.count / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Recent uploads</p>
          {recentUploads.map((doc) => (
            <Link
              key={doc.id}
              href={`${basePath}/documents`}
              className="flex items-center gap-3 rounded-lg px-1.5 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {doc.matter?.title ?? "Unfiled"} · {doc.uploadedBy.name} · {formatBytes(doc.sizeBytes)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <DocumentStatusPill status={doc.status} />
                <span className="text-xs text-muted-foreground">{formatTimeAgo(doc.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
