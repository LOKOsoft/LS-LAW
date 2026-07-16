"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function toggleTemplateFavorite(templateId: string, isFavorite: boolean) {
  await prisma.template.update({ where: { id: templateId }, data: { isFavorite } });
  revalidatePath("/managing-partner/document-generator");
  revalidatePath("/managing-partner/template-library");
}
