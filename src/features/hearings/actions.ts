"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { createHearingSchema, type CreateHearingInput } from "@/features/hearings/schema";

export async function createHearing(input: CreateHearingInput) {
  const data = createHearingSchema.parse(input);

  const hearing = await prisma.hearing.create({
    data: {
      matterId: data.matterId,
      courtName: data.courtName,
      courtroom: data.courtroom || null,
      judge: data.judge || null,
      hearingType: data.hearingType,
      scheduledAt: new Date(data.scheduledAt),
    },
  });

  revalidatePath("/managing-partner/hearings");
  revalidatePath("/managing-partner");
  return hearing;
}
