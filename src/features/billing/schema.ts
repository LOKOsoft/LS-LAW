import { z } from "zod";

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  matterId: z.string().optional(),
  description: z.string().min(2, "Description is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
