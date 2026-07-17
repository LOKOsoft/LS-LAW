import { z } from "zod";

export const createHearingSchema = z.object({
  matterId: z.string().min(1, "Matter is required"),
  courtName: z.string().min(2, "Court is required"),
  courtroom: z.string().optional(),
  judge: z.string().optional(),
  hearingType: z.string().min(2, "Hearing type is required"),
  scheduledAt: z.string().min(1, "Date is required"),
});

export type CreateHearingInput = z.infer<typeof createHearingSchema>;

export const updateHearingSchema = z.object({
  scheduledAt: z.string().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "ADJOURNED", "CANCELLED"]).optional(),
  outcome: z.string().optional(),
  notes: z.string().optional(),
  nextHearingDate: z.string().optional(),
});

export type UpdateHearingInput = z.infer<typeof updateHearingSchema>;
