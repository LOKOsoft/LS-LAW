"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function toggleClauseFavorite(clauseId: string, isFavorite: boolean) {
  await prisma.clause.update({ where: { id: clauseId }, data: { isFavorite } });
  revalidatePath("/managing-partner/clause-library");
}
