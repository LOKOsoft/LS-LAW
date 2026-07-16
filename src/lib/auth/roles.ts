import { Role } from "@/generated/prisma/client";

export const ROLE_HOME: Record<Role, string> = {
  [Role.MANAGING_PARTNER]: "/managing-partner",
  [Role.SENIOR_PARTNER]: "/senior-partner",
  [Role.PARTNER]: "/partner",
  [Role.ASSOCIATE]: "/associate",
  [Role.JUNIOR_ASSOCIATE]: "/junior-associate",
  [Role.LEGAL_RESEARCHER]: "/legal-researcher",
  [Role.PARALEGAL]: "/paralegal",
  [Role.RECEPTION]: "/reception",
  [Role.ACCOUNTS]: "/accounts",
  [Role.HR]: "/hr",
  [Role.OFFICE_MANAGER]: "/office-manager",
  [Role.ADMINISTRATOR]: "/administrator",
  [Role.CLIENT]: "/client",
};
