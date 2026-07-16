import { z } from "zod";

export const createMatterSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
  practiceAreaId: z.string().min(1, "Practice area is required"),
  responsibleAttorneyId: z.string().min(1, "Responsible attorney is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  billingType: z.enum(["HOURLY", "FIXED_FEE", "CONTINGENCY", "RETAINER"]),
  estimatedValue: z.number().min(0).optional(),
});

export type CreateMatterInput = z.infer<typeof createMatterSchema>;
