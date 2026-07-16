"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/format";
import { generateInvoiceFromUnbilledTime } from "@/features/billing/actions";
import type { getUnbilledTimeByMatter } from "@/features/billing/queries";

export function UnbilledTimeCard({ items }: { items: Awaited<ReturnType<typeof getUnbilledTimeByMatter>> }) {
  const [generatingId, setGeneratingId] = React.useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate(matterId: string, matterTitle: string) {
    setGeneratingId(matterId);
    try {
      const invoice = await generateInvoiceFromUnbilledTime(matterId);
      toast.success("Invoice generated", { description: `${invoice.invoiceNumber} created from unbilled time on ${matterTitle}.` });
      router.refresh();
    } catch {
      toast.error("Could not generate invoice. Please try again.");
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unbilled time</CardTitle>
        <CardDescription>Generate a draft invoice directly from logged, unbilled hours</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Clock} title="No unbilled time" description="All logged billable hours have been invoiced." />
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.matterId} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.matterTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.matterNumber} · {item.clientName} · {item.hours}h across {item.entryCount} entries
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(item.estimatedAmount)}</span>
                  <Button
                    size="sm"
                    disabled={generatingId === item.matterId}
                    onClick={() => handleGenerate(item.matterId, item.matterTitle)}
                  >
                    {generatingId === item.matterId ? "Generating..." : "Generate invoice"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
