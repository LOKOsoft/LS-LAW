import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["INDIVIDUAL", "COMPANY"]),
  industry: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  source: z.string().optional(),
  relationshipManagerId: z.string().min(1, "Relationship manager is required"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.extend({
  taxId: z.string().optional(),
  addressLine1: z.string().optional(),
  postalCode: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export const createNoteSchema = z.object({
  body: z.string().min(2, "Note cannot be empty"),
  clientId: z.string().optional(),
  matterId: z.string().optional(),
  authorId: z.string().min(1),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const mergeClientsSchema = z
  .object({
    primaryClientId: z.string().min(1, "Select the client to keep"),
    duplicateClientId: z.string().min(1, "Select the duplicate to merge"),
  })
  .refine((data) => data.primaryClientId !== data.duplicateClientId, {
    message: "Select two different clients",
    path: ["duplicateClientId"],
  });

export type MergeClientsInput = z.infer<typeof mergeClientsSchema>;

export const importClientRowSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["INDIVIDUAL", "COMPANY"]).default("COMPANY"),
  industry: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  taxId: z.string().optional(),
  relationshipManagerId: z.string().min(1, "Relationship manager is required"),
});

export type ImportClientRow = z.infer<typeof importClientRowSchema>;
