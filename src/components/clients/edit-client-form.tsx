"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDrawer } from "@/components/shared/form-drawer";
import { ClientFormFields, type ManagerOption } from "@/components/clients/client-form-fields";
import { updateClientSchema, type UpdateClientInput } from "@/features/clients/schema";
import { updateClient } from "@/features/clients/actions";
import type { ClientDetail } from "@/features/clients/queries";

export function EditClientForm({
  client,
  managers,
}: {
  client: ClientDetail;
  managers: ManagerOption[];
}) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<UpdateClientInput>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: client.name,
      type: client.type,
      industry: client.industry ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
      city: client.city ?? "",
      state: client.state ?? "",
      source: client.source ?? "",
      relationshipManagerId: client.relationshipManagerId ?? managers[0]?.id ?? "",
      taxId: client.taxId ?? "",
      addressLine1: client.addressLine1 ?? "",
      postalCode: client.postalCode ?? "",
      status: client.status === "ARCHIVED" ? "ACTIVE" : client.status,
    },
  });

  async function onSubmit(values: UpdateClientInput) {
    setIsSubmitting(true);
    try {
      await updateClient(client.id, values);
      toast.success("Client updated");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not update client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormDrawer
      trigger={
        <Button variant="outline" className="gap-1.5">
          <Pencil className="size-4" />
          Edit
        </Button>
      }
      title="Edit client"
      description="Update this client's profile details."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <ClientFormFields form={form} managers={managers} />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PROSPECT">Prospect</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID / GSTIN</FormLabel>
                <FormControl>
                  <Input placeholder="27AAFCL1234K1ZQ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                  <Input placeholder="400001" {...field} />
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
