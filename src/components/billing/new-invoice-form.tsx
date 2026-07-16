"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDrawer } from "@/components/shared/form-drawer";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/features/billing/schema";
import { createInvoice } from "@/features/billing/actions";

type ClientOption = { id: string; name: string };
type MatterOption = { id: string; title: string; matterNumber: string };

export function NewInvoiceForm({
  clients,
  matters,
  defaultOpen = false,
}: {
  clients: ClientOption[];
  matters: MatterOption[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { clientId: clients[0]?.id ?? "", matterId: undefined, description: "", amount: 0 },
  });

  async function onSubmit(values: CreateInvoiceInput) {
    setIsSubmitting(true);
    try {
      const invoice = await createInvoice(values);
      toast.success("Invoice created", { description: `${invoice.invoiceNumber} saved as draft.` });
      setOpen(false);
      form.reset();
      router.refresh();
    } catch {
      toast.error("Could not create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormDrawer
      trigger={
        <Button className="gap-1.5">
          <Receipt className="size-4" />
          New Invoice
        </Button>
      }
      title="New invoice"
      description="Create a draft invoice for a client engagement."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create invoice"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="matterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matter (optional)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No specific matter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {matters.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title} ({m.matterNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line item description</FormLabel>
                <FormControl>
                  <Input placeholder="Professional fees for..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹, before tax)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 150000"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDrawer>
  );
}
