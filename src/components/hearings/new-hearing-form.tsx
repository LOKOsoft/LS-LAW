"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDrawer } from "@/components/shared/form-drawer";
import { createHearingSchema, type CreateHearingInput } from "@/features/hearings/schema";
import { createHearing } from "@/features/hearings/actions";

type MatterOption = { id: string; title: string; matterNumber: string };

export function NewHearingForm({ matters, defaultOpen = false }: { matters: MatterOption[]; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<CreateHearingInput>({
    resolver: zodResolver(createHearingSchema),
    defaultValues: { matterId: matters[0]?.id ?? "", courtName: "", courtroom: "", judge: "", hearingType: "", scheduledAt: "" },
  });

  async function onSubmit(values: CreateHearingInput) {
    setIsSubmitting(true);
    try {
      await createHearing(values);
      toast.success("Hearing scheduled");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch {
      toast.error("Could not schedule hearing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormDrawer
      trigger={
        <Button className="gap-1.5">
          <Gavel className="size-4" />
          Schedule Hearing
        </Button>
      }
      title="Schedule hearing"
      description="Add a new court date for a matter."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule hearing"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="matterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matter</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a matter" />
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
            name="hearingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hearing type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. First Hearing, Arguments..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courtName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Court</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bombay High Court" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="courtroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courtroom</FormLabel>
                  <FormControl>
                    <Input placeholder="Court No. 9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="judge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judge</FormLabel>
                  <FormControl>
                    <Input placeholder="Hon'ble Justice..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date &amp; time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
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
