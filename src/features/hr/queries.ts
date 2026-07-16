import { prisma } from "@/lib/db/prisma";

export async function getTeamMembers() {
  return prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    include: { office: { select: { name: true } } },
  });
}
export type TeamMember = Awaited<ReturnType<typeof getTeamMembers>>[number];
