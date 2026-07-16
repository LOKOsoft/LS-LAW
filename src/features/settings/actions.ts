"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { Role, CourtType } from "@/generated/prisma/client";

export async function toggleUserStatus(userId: string) {
  await requireUser(Role.MANAGING_PARTNER);
  const target = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  await prisma.user.update({
    where: { id: userId },
    data: { status: target.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
  });
  revalidatePath("/", "layout");
}

const courtListEntrySchema = z.object({
  name: z.string().min(2, "Court name is required"),
  type: z.nativeEnum(CourtType),
  city: z.string().optional(),
  state: z.string().optional(),
  caseNumberPattern: z.string().optional(),
});
export type CourtListEntryInput = z.infer<typeof courtListEntrySchema>;

export async function createCourtListEntry(input: CourtListEntryInput) {
  await requireUser();
  const data = courtListEntrySchema.parse(input);
  await prisma.courtListEntry.create({
    data: {
      name: data.name,
      type: data.type,
      city: data.city || null,
      state: data.state || null,
      caseNumberPattern: data.caseNumberPattern || null,
    },
  });
  revalidatePath("/", "layout");
}

export async function deleteCourtListEntry(id: string) {
  await requireUser();
  await prisma.courtListEntry.delete({ where: { id } });
  revalidatePath("/", "layout");
}
