"use client";

import type { UseFormReturn, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { CreateClientInput } from "@/features/clients/schema";

export type ManagerOption = { id: string; name: string; title: string | null };

/**
 * The client fields shared by both the create and edit flows. Extracted so the two forms
 * (new-client-form.tsx, edit-client-form.tsx) don't hand-duplicate the same field markup.
 */
export function ClientFormFields<TFieldValues extends CreateClientInput>({
  form,
  managers,
}: {
  form: UseFormReturn<TFieldValues>;
  managers: ManagerOption[];
}) {
  const name = <K extends keyof CreateClientInput>(key: K) => key as unknown as Path<TFieldValues>;

  return (
    <>
      <FormField
        control={form.control}
        name={name("type")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="COMPANY">Company</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={name("name")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Meridian Textiles Pvt. Ltd." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={name("industry")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Manufacturing" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={name("email")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@client.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={name("phone")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+91 98XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={name("city")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Mumbai" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={name("state")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="Maharashtra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={name("source")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source</FormLabel>
            <FormControl>
              <Input placeholder="Referral, Website, Conference..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={name("relationshipManagerId")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relationship manager</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} {m.title ? `· ${m.title}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
