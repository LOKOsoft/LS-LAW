import { prisma } from "@/lib/db/prisma";

export async function getFirm() {
  const firm = await prisma.firm.findFirst();
  if (!firm) {
    throw new Error("Firm record not found. Run `npm run db:seed` to seed the database.");
  }
  return firm;
}
