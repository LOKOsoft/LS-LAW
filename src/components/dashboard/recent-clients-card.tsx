import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientStatusPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { initials, formatDate } from "@/lib/format";

type RecentClient = {
  id: string;
  name: string;
  clientNumber: string;
  industry: string | null;
  status: string;
  createdAt: Date;
  type: string;
};

export function RecentClientsCard({ clients }: { clients: RecentClient[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent clients</CardTitle>
        <CardDescription>Newest additions to the firm&apos;s client base</CardDescription>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <EmptyState icon={Users} title="No clients yet" description="New clients will appear here." />
        ) : (
          <div className="space-y-1">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/managing-partner/clients/${client.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(client.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{client.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {client.clientNumber} · {client.industry ?? client.type}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <ClientStatusPill status={client.status} />
                  <span className="text-xs text-muted-foreground">{formatDate(client.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
