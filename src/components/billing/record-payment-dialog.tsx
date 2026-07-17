"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormModal } from "@/components/shared/form-modal";
import { recordPayment } from "@/features/billing/actions";
import { formatCurrency } from "@/lib/format";
import type { InvoiceListItem } from "@/features/billing/queries";
import type { RecordPaymentInput } from "@/features/billing/schema";

type PaymentMethodValue = RecordPaymentInput["method"];

export function RecordPaymentDialog({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: InvoiceListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState<PaymentMethodValue>("BANK_TRANSFER");
  const [reference, setReference] = React.useState("");

  const balance = invoice ? invoice.total - invoice.amountPaid : 0;

  // Reset the form fields whenever a different invoice is selected — computed during render
  // rather than an effect, since the dialog stays mounted across selections.
  const [loadedInvoiceId, setLoadedInvoiceId] = React.useState<string | null>(null);
  if (invoice && invoice.id !== loadedInvoiceId) {
    setLoadedInvoiceId(invoice.id);
    setAmount(String(invoice.total - invoice.amountPaid));
    setMethod("BANK_TRANSFER");
    setReference("");
  }

  async function handleSubmit() {
    if (!invoice) return;
    const amountNumber = Number(amount);
    if (!amountNumber || amountNumber <= 0) {
      toast.error("Enter a payment amount greater than zero.");
      return;
    }
    setIsSubmitting(true);
    try {
      await recordPayment(invoice.id, { amount: amountNumber, method, reference });
      toast.success("Payment recorded", { description: `${formatCurrency(amountNumber)} applied to ${invoice.invoiceNumber}.` });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not record the payment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={invoice ? `Record payment — ${invoice.invoiceNumber}` : "Record payment"}
      description={invoice ? `Balance due: ${formatCurrency(balance)}. This updates the invoice, client outstanding, and reports immediately.` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record payment"}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="payment-amount">Amount (₹)</Label>
          <Input id="payment-amount" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="payment-method">Method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethodValue)}>
            <SelectTrigger id="payment-method" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              <SelectItem value="CHEQUE">Cheque</SelectItem>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="payment-reference">Reference</Label>
          <Input id="payment-reference" placeholder="Transaction / cheque number..." value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
      </div>
    </FormModal>
  );
}
