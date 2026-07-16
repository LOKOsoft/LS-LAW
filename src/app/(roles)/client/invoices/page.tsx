import { Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { InvoiceStatusPill } from "@/components/shared/status-pill";
import { formatCurrency, formatDate } from "@/lib/format";
import { requirePortalUser } from "@/lib/auth/dal";
import { getPortalInvoices } from "@/features/client-portal/queries";

export default async function ClientPortalInvoicesPage() {
  const { client } = await requirePortalUser();
  const invoices = await getPortalInvoices(client.id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Invoices</h1>
        <p className="text-sm text-muted-foreground">Your billing history. Online payment is coming in a future release.</p>
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices yet" />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{inv.invoiceNumber}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inv.matter?.title ?? "General"} · Issued {formatDate(inv.issueDate)} · Due {formatDate(inv.dueDate)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(inv.total)}</span>
                  <InvoiceStatusPill status={inv.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
