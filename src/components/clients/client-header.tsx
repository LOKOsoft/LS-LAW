import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ClientStatusPill } from "@/components/shared/status-pill";
import { initials, formatCurrencyCompact, formatDate } from "@/lib/format";
import type { ClientDetail } from "@/features/clients/queries";

export function ClientHeader({ client }: { client: ClientDetail }) {
  const totalBilled = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const openMatters = client.matters.filter((m) => m.status === "ACTIVE" || m.status === "INTAKE").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg text-primary">{initials(client.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{client.name}</h1>
              <ClientStatusPill status={client.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {client.clientNumber} · {client.industry ?? client.type} · Client since {formatDate(client.createdAt)}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm text-muted-foreground">
              {client.email ? (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {client.email}
                </span>
              ) : null}
              {client.phone ? (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {client.phone}
                </span>
              ) : null}
              {client.city ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {client.city}, {client.state}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Open matters</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">{openMatters}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Total billed</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">{formatCurrencyCompact(totalBilled)}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Documents</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">{client.documents.length}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="size-3" /> Relationship manager
            </p>
            <p className="truncate text-sm font-medium text-foreground">{client.relationshipManager?.name ?? "Unassigned"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
