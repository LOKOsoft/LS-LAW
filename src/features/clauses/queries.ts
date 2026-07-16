import { prisma } from "@/lib/db/prisma";

export async function getClauses() {
  return prisma.clause.findMany({ orderBy: [{ isFavorite: "desc" }, { usageCount: "desc" }] });
}
export type ClauseItem = Awaited<ReturnType<typeof getClauses>>[number];
