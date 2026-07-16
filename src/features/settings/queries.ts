import { prisma } from "@/lib/db/prisma";

export async function getSettingsData() {
  const [firm, offices, practiceAreas, courts, templateCount, users] = await Promise.all([
    prisma.firm.findFirst(),
    prisma.office.findMany({ orderBy: { isPrimary: "desc" } }),
    prisma.practiceArea.findMany({ orderBy: { name: "asc" } }),
    prisma.courtListEntry.findMany({ orderBy: { name: "asc" } }),
    prisma.template.count(),
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { name: "asc" }],
      include: { office: { select: { name: true } } },
    }),
  ]);

  return { firm, offices, practiceAreas, courts, templateCount, users };
}
