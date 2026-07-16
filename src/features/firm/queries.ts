import { prisma } from "@/lib/db/prisma";
import { Role } from "@/generated/prisma/client";

export async function getFirm() {
  const firm = await prisma.firm.findFirst();
  if (!firm) {
    throw new Error("Firm record not found. Run `npm run db:seed` to seed the database.");
  }
  return firm;
}

export async function getManagingPartner() {
  const partner = await prisma.user.findFirst({ where: { role: Role.MANAGING_PARTNER } });
  if (!partner) {
    throw new Error("No managing partner found. Run `npm run db:seed` to seed the database.");
  }
  return partner;
}
