import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientStatusPill } from "@/components/shared/status-pill";
import { UserCircle, Users } from "lucide-react";
import { initials } from "@/lib/format";
import type { RelationshipManagerGroup } from "@/features/clients/queries";

export function RelationshipManagerView({
  groups,
  basePath = "/managing-partner",
}: {
  groups: RelationshipManagerGroup[];
  basePath?: string;
}) {
  const totalClients = groups.reduce((sum, g) => sum + g.clients.length, 0);

  if (totalClients === 0) {
    return <EmptyState icon={Users} title="No clients yet" description="Assign a relationship manager when you add a client to see the roster here." />;
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.manager?.id ?? "unassigned"}>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-sm text-primary">
                {group.manager ? initials(group.manager.name) : <UserCircle className="size-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{group.manager?.name ?? "Unassigned"}</p>
              <p className="truncate text-xs text-muted-foreground">{group.manager?.title ?? "No relationship manager assigned"}</p>
            </div>
            <Badge variant="secondary">{group.clients.length} clients</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {group.clients.map((client) => (
              <Link
                key={client.id}
                href={`${basePath}/clients/${client.id}`}
                className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{client.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {client.clientNumber} · {client.industry ?? "—"} · {client._count.matters} matters
                  </p>
                </div>
                <ClientStatusPill status={client.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
