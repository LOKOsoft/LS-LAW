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

export const createNoteSchema = z.object({
  body: z.string().min(2, "Note cannot be empty"),
  clientId: z.string().optional(),
  matterId: z.string().optional(),
  authorId: z.string().min(1),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
