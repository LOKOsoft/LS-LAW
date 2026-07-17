"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormDrawer } from "@/components/shared/form-drawer";
import { ClientFormFields, type ManagerOption } from "@/components/clients/client-form-fields";
import { createClientSchema, type CreateClientInput } from "@/features/clients/schema";
import { createClient, checkSimilarClientNames } from "@/features/clients/actions";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function NewClientForm({ managers, defaultOpen = false }: { managers: ManagerOption[]; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [similar, setSimilar] = React.useState<{ id: string; name: string; clientNumber: string }[]>([]);
  const router = useRouter();

  const form = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      type: "COMPANY",
      industry: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      source: "",
      relationshipManagerId: managers[0]?.id ?? "",
    },
  });

  const nameValue = form.watch("name");
  const debouncedName = useDebouncedValue(nameValue, 400);

  React.useEffect(() => {
    if (!open || debouncedName.trim().length < 2) {
      setSimilar([]);
      return;
    }
    let cancelled = false;
    checkSimilarClientNames(debouncedName).then((matches) => {
      if (!cancelled) setSimilar(matches);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedName, open]);

  async function onSubmit(values: CreateClientInput) {
    setIsSubmitting(true);
    try {
      const client = await createClient(values);
      toast.success("Client added", { description: `${client.name} has been added to the client base.` });
      setOpen(false);
      form.reset();
      setSimilar([]);
      router.refresh();
    } catch {
      toast.error("Could not create client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormDrawer
      trigger={
        <Button className="gap-1.5">
          <UserPlus className="size-4" />
          New Client
        </Button>
      }
      title="New client"
      description="Add a new client to the firm's client base."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add client"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {similar.length > 0 ? (
            <div className="flex gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <div>
                <p className="font-medium">Possible duplicate client</p>
                <p className="text-xs text-muted-foreground">
                  {similar.map((c) => `${c.name} (${c.clientNumber})`).join(", ")} already exist{similar.length === 1 ? "s" : ""}{" "}
                  with a very similar name. You can still add this client if it&apos;s a different entity.
                </p>
              </div>
            </div>
          ) : null}
          <ClientFormFields form={form} managers={managers} />
        </form>
      </Form>
    </FormDrawer>
  );
}
