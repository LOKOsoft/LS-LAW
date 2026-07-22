"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { withPermission } from "@/lib/platform/auth";

async function toggleClauseFavoriteImpl(clauseId: string, isFavorite: boolean) {
  await requireUser();
  await prisma.clause.update({ where: { id: clauseId }, data: { isFavorite } });
  revalidatePath("/", "layout");
}

/** Records that a clause was inserted into a draft — bumps `usageCount` and `lastUsedAt`, which drives the "Recently used" section and usage-based sort. */
async function recordClauseUsageImpl(clauseId: string) {
  await requireUser();
  await prisma.clause.update({
    where: { id: clauseId },
    data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
  });
  revalidatePath("/", "layout");
}

export const toggleClauseFavorite = withPermission({ moduleKey: "clause-library", action: "view" }, toggleClauseFavoriteImpl);
export const recordClauseUsage = withPermission({ moduleKey: "clause-library", action: "view" }, recordClauseUsageImpl);
