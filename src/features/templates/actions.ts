"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";

export async function toggleTemplateFavorite(templateId: string, isFavorite: boolean) {
  await requireUser();
  await prisma.template.update({ where: { id: templateId }, data: { isFavorite } });
  revalidatePath("/", "layout");
}
