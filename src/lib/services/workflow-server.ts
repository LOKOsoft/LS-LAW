import type { MatterStage } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { MATTER_STAGE_ORDER } from "@/lib/services/workflow";

/** Nudges a matter's stage forward when an event implies progress — never regresses a matter that's already further along. */
export async function bumpMatterStageIfEarlier(matterId: string, currentStage: MatterStage, target: MatterStage) {
  if (MATTER_STAGE_ORDER.indexOf(currentStage) >= MATTER_STAGE_ORDER.indexOf(target)) return;
  await prisma.matter.update({ where: { id: matterId }, data: { stage: target } });
}
