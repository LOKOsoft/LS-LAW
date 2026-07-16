import { prisma } from "@/lib/db/prisma";

export async function getTemplates() {
  return prisma.template.findMany({ orderBy: [{ isFavorite: "desc" }, { usageCount: "desc" }] });
}
export type TemplateItem = Awaited<ReturnType<typeof getTemplates>>[number];

export async function getRecentlyUsedTemplates() {
  return prisma.template.findMany({ where: { lastUsedAt: { not: null } }, orderBy: { lastUsedAt: "desc" }, take: 6 });
}
