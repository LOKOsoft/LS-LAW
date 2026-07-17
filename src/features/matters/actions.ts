"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { MatterStatus, MatterStage, MatterTeamRole, NotificationType } from "@/generated/prisma/client";
import { createMatterSchema, type CreateMatterInput } from "@/features/matters/schema";
import { logActivity } from "@/lib/services/activity";
import { notifyUsers } from "@/lib/services/notifications";
import { buildDefaultMatterTasks } from "@/lib/services/task-templates";
import { assertMatterHasNoUnpaidInvoices, assertMatterHasNoPendingHearings } from "@/lib/services/validation";
import { assertValidStageTransition, MATTER_STAGE_LABELS } from "@/lib/services/workflow";

export async function createMatter(input: CreateMatterInput) {
  const data = createMatterSchema.parse(input);

  const count = await prisma.matter.count();
  const year = new Date().getFullYear();
  const matterNumber = `LEX-${year}-${String(count + 1).padStart(4, "0")}`;
  const openedDate = new Date();
  const defaultTasks = buildDefaultMatterTasks(openedDate);

  const matter = await prisma.$transaction(async (tx) => {
    const created = await tx.matter.create({
      data: {
        matterNumber,
        title: data.title,
        description: data.description || null,
        clientId: data.clientId,
        practiceAreaId: data.practiceAreaId,
        responsibleAttorneyId: data.responsibleAttorneyId,
        priority: data.priority,
        billingType: data.billingType,
        estimatedValue: data.estimatedValue ?? null,
        status: MatterStatus.INTAKE,
        stage: MatterStage.MATTER_CREATED,
        openedDate,
      },
    });

    await tx.matterTeamMember.create({
      data: { matterId: created.id, userId: data.responsibleAttorneyId, role: MatterTeamRole.LEAD },
    });

    await tx.task.createMany({
      data: defaultTasks.map((t) => ({
        title: t.title,
        description: t.description,
        matterId: created.id,
        assigneeId: data.responsibleAttorneyId,
        createdById: data.responsibleAttorneyId,
        priority: t.priority,
        dueDate: t.dueDate,
      })),
    });

    await logActivity(
      {
        action: "created a new matter",
        entityType: "MATTER",
        entityId: created.id,
        matterId: created.id,
        clientId: data.clientId,
        actorId: data.responsibleAttorneyId,
        currentValue: MatterStage.MATTER_CREATED,
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );

    await notifyUsers(
      {
        userIds: [data.responsibleAttorneyId],
        type: NotificationType.TASK_ASSIGNED,
        title: `New matter opened: ${created.title}`,
        body: `${defaultTasks.length} opening tasks were generated automatically.`,
        matterId: created.id,
      },
      tx,
    );

    return created;
  });

  revalidatePath("/", "layout");
  return matter;
}

/** Moves a matter to the next stage in its pipeline, enforcing sequence and closure/archive business rules. */
export async function advanceMatterStage(matterId: string, targetStage: MatterStage, actorId: string) {
  const matter = await prisma.matter.findUniqueOrThrow({ where: { id: matterId } });
  assertValidStageTransition(matter.stage, targetStage);

  if (targetStage === MatterStage.CLOSURE) {
    await assertMatterHasNoUnpaidInvoices(matterId);
  }
  if (targetStage === MatterStage.ARCHIVE) {
    await assertMatterHasNoPendingHearings(matterId);
  }

  const statusForStage: Partial<Record<MatterStage, MatterStatus>> = {
    CLOSURE: MatterStatus.CLOSED,
    ARCHIVE: MatterStatus.ARCHIVED,
  };

  const updated = await prisma.matter.update({
    where: { id: matterId },
    data: {
      stage: targetStage,
      status: statusForStage[targetStage] ?? matter.status,
      closedDate: targetStage === MatterStage.CLOSURE ? new Date() : matter.closedDate,
    },
  });

  await logActivity({
    action: `advanced matter stage to ${MATTER_STAGE_LABELS[targetStage]}`,
    entityType: "MATTER",
    entityId: matterId,
    matterId,
    clientId: matter.clientId,
    actorId,
    previousValue: matter.stage,
    currentValue: targetStage,
    source: "WORKFLOW_ENGINE",
  });

  revalidatePath("/", "layout");
  return updated;
}

/** Closing/archiving are reachable from any active stage — they don't require walking the full pipeline, only the business-rule gate. */
async function terminateMatter(matterId: string, actorId: string, targetStage: typeof MatterStage.CLOSURE | typeof MatterStage.ARCHIVE) {
  const matter = await prisma.matter.findUniqueOrThrow({ where: { id: matterId } });

  if (targetStage === MatterStage.CLOSURE) {
    await assertMatterHasNoUnpaidInvoices(matterId);
  } else {
    await assertMatterHasNoPendingHearings(matterId);
  }

  const updated = await prisma.matter.update({
    where: { id: matterId },
    data: {
      stage: targetStage,
      status: targetStage === MatterStage.CLOSURE ? MatterStatus.CLOSED : MatterStatus.ARCHIVED,
      closedDate: targetStage === MatterStage.CLOSURE ? new Date() : matter.closedDate,
    },
  });

  await logActivity({
    action: targetStage === MatterStage.CLOSURE ? "closed the matter" : "archived the matter",
    entityType: "MATTER",
    entityId: matterId,
    matterId,
    clientId: matter.clientId,
    actorId,
    previousValue: matter.stage,
    currentValue: targetStage,
    source: "WORKFLOW_ENGINE",
  });

  revalidatePath("/", "layout");
  return updated;
}

export async function closeMatter(matterId: string, actorId: string) {
  return terminateMatter(matterId, actorId, MatterStage.CLOSURE);
}

export async function archiveMatter(matterId: string, actorId: string) {
  return terminateMatter(matterId, actorId, MatterStage.ARCHIVE);
}
