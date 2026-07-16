import { prisma } from "@/lib/db/prisma";

export async function getSettingsData() {
  const [firm, offices, practiceAreas, courts, templateCount] = await Promise.all([
    prisma.firm.findFirst(),
    prisma.office.findMany({ orderBy: { isPrimary: "desc" } }),
    prisma.practiceArea.findMany({ orderBy: { name: "asc" } }),
    prisma.courtListEntry.findMany({ orderBy: { name: "asc" } }),
    prisma.template.count(),
  ]);

  return { firm, offices, practiceAreas, courts, templateCount };
}
