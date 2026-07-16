import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MatterStatusPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import type { MatterListItem } from "@/features/matters/queries";

export function MyMattersCard({
  matters,
  basePath = "/managing-partner",
}: {
  matters: MatterListItem[];
  basePath?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My matters</CardTitle>
        <CardDescription>Matters you lead or are assigned to</CardDescription>
      </CardHeader>
      <CardContent>
        {matters.length === 0 ? (
          <EmptyState icon={Briefcase} title="No assigned matters" description="Matters you lead or join will appear here." />
        ) : (
          <div className="space-y-1">
            {matters.map((matter) => (
              <Link
                key={matter.id}
                href={`${basePath}/matters/${matter.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{matter.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {matter.matterNumber} · {matter.client.name}
                  </p>
                </div>
                <MatterStatusPill status={matter.status} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
