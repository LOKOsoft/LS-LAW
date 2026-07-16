"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDrawer } from "@/components/shared/form-drawer";
import { createMatterSchema, type CreateMatterInput } from "@/features/matters/schema";
import { createMatter } from "@/features/matters/actions";

type Option = { id: string; name: string; title?: string | null };

export function NewMatterForm({
  clients,
  practiceAreas,
  attorneys,
  defaultOpen = false,
  basePath = "/managing-partner",
}: {
  clients: Option[];
  practiceAreas: Option[];
  attorneys: Option[];
  defaultOpen?: boolean;
  basePath?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<CreateMatterInput>({
    resolver: zodResolver(createMatterSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: clients[0]?.id ?? "",
      practiceAreaId: practiceAreas[0]?.id ?? "",
      responsibleAttorneyId: attorneys[0]?.id ?? "",
      priority: "MEDIUM",
      billingType: "HOURLY",
      estimatedValue: undefined,
    },
  });

  async function onSubmit(values: CreateMatterInput) {
    setIsSubmitting(true);
    try {
      const matter = await createMatter(values);
      toast.success("Matter created", { description: `${matter.matterNumber} has been opened.` });
      setOpen(false);
      form.reset();
      router.push(`${basePath}/matters/${matter.id}`);
    } catch {
      toast.error("Could not create matter. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormDrawer
      trigger={
        <Button className="gap-1.5">
          <BriefcaseBusiness className="size-4" />
          New Matter
        </Button>
      }
      title="New matter"
      description="Open a new matter for an existing client."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create matter"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matter title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Share Purchase Agreement — Acquisition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="practiceAreaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Practice area</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a practice area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {practiceAreas.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
            name="responsibleAttorneyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsible attorney</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an attorney" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {attorneys.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} {a.title ? `· ${a.title}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOURLY">Hourly</SelectItem>
                      <SelectItem value="FIXED_FEE">Fixed Fee</SelectItem>
                      <SelectItem value="CONTINGENCY">Contingency</SelectItem>
                      <SelectItem value="RETAINER">Retainer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="estimatedValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated value (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 1500000"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Brief summary of the matter..." {...field} />
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
