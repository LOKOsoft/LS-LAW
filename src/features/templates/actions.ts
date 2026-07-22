"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { withPermission } from "@/lib/platform/auth";

async function toggleTemplateFavoriteImpl(templateId: string, isFavorite: boolean) {
  await requireUser();
  await prisma.template.update({ where: { id: templateId }, data: { isFavorite } });
  revalidatePath("/", "layout");
}

export const toggleTemplateFavorite = withPermission({ moduleKey: "template-library", action: "view" }, toggleTemplateFavoriteImpl);
