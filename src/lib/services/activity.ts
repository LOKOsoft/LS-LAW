import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

type LogActivityInput = {
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  matterId?: string | null;
  clientId?: string | null;
  previousValue?: string | null;
  currentValue?: string | null;
  source?: string;
};

/** Central write path for the timeline/audit trail — every mutating action should route through this. */
export function logActivity(input: LogActivityInput, client: Prisma.TransactionClient | typeof prisma = prisma) {
  return client.activityLog.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      actorId: input.actorId,
      matterId: input.matterId ?? null,
      clientId: input.clientId ?? null,
      previousValue: input.previousValue ?? null,
      currentValue: input.currentValue ?? null,
      source: input.source ?? "APP",
    },
  });
}
