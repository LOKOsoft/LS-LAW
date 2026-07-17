"use server";

import { subDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { HearingStatus, MatterStage, NotificationType } from "@/generated/prisma/client";
import { createHearingSchema, updateHearingSchema, type CreateHearingInput, type UpdateHearingInput } from "@/features/hearings/schema";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/services/activity";
import { notifyUsers } from "@/lib/services/notifications";
import { bumpMatterStageIfEarlier } from "@/lib/services/workflow-server";

async function getMatterTeamUserIds(matterId: string) {
  const matter = await prisma.matter.findUniqueOrThrow({
    where: { id: matterId },
    include: { team: { select: { userId: true } } },
  });
  return { matter, userIds: Array.from(new Set([matter.responsibleAttorneyId, ...matter.team.map((t) => t.userId)])) };
}

export async function createHearing(input: CreateHearingInput) {
  const data = createHearingSchema.parse(input);
  const actor = await requireUser();
  const scheduledAt = new Date(data.scheduledAt);

  const { matter, userIds } = await getMatterTeamUserIds(data.matterId);

  const hearing = await prisma.$transaction(async (tx) => {
    const created = await tx.hearing.create({
      data: {
        matterId: data.matterId,
        courtName: data.courtName,
        courtroom: data.courtroom || null,
        judge: data.judge || null,
        hearingType: data.hearingType,
        scheduledAt,
      },
    });

    const prepDueDate = subDays(scheduledAt, 2) > new Date() ? subDays(scheduledAt, 2) : new Date();
    await tx.task.create({
      data: {
        title: `Prepare for hearing — ${data.hearingType}`,
        description: `Prep for the ${data.hearingType} hearing at ${data.courtName} on ${scheduledAt.toLocaleString()}.`,
        matterId: data.matterId,
        assigneeId: matter.responsibleAttorneyId,
        createdById: actor.id,
        priority: "HIGH",
        dueDate: prepDueDate,
      },
    });

    await logActivity(
      {
        action: "scheduled a hearing",
        entityType: "HEARING",
        entityId: created.id,
        matterId: data.matterId,
        clientId: matter.clientId,
        actorId: actor.id,
        currentValue: scheduledAt.toISOString(),
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );

    await notifyUsers(
      {
        userIds,
        type: NotificationType.HEARING,
        title: `Hearing scheduled — ${matter.title}`,
        body: `${data.hearingType} at ${data.courtName} on ${scheduledAt.toLocaleString()}.`,
        matterId: data.matterId,
      },
      tx,
    );

    return created;
  });

  await bumpMatterStageIfEarlier(data.matterId, matter.stage, MatterStage.COURT_HEARING);

  revalidatePath("/", "layout");
  return hearing;
}

/** Reschedule / status update — cascades to the matter timeline, team notifications, and (on completion) the matter stage. */
export async function updateHearing(hearingId: string, input: UpdateHearingInput) {
  const data = updateHearingSchema.parse(input);
  const actor = await requireUser();

  const existing = await prisma.hearing.findUniqueOrThrow({ where: { id: hearingId } });
  const { matter, userIds } = await getMatterTeamUserIds(existing.matterId);

  const nextScheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : existing.scheduledAt;
  const dateChanged = nextScheduledAt.getTime() !== existing.scheduledAt.getTime();
  const statusChanged = data.status && data.status !== existing.status;

  const updated = await prisma.$transaction(async (tx) => {
    const hearing = await tx.hearing.update({
      where: { id: hearingId },
      data: {
        scheduledAt: nextScheduledAt,
        status: data.status ?? existing.status,
        outcome: data.outcome ?? existing.outcome,
        notes: data.notes ?? existing.notes,
        nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : existing.nextHearingDate,
      },
    });

    if (dateChanged) {
      await logActivity(
        {
          action: "rescheduled a hearing",
          entityType: "HEARING",
          entityId: hearing.id,
          matterId: existing.matterId,
          clientId: matter.clientId,
          actorId: actor.id,
          previousValue: existing.scheduledAt.toISOString(),
          currentValue: nextScheduledAt.toISOString(),
          source: "WORKFLOW_ENGINE",
        },
        tx,
      );
      const prepTask = await tx.task.findFirst({
        where: { matterId: existing.matterId, title: { contains: "Prepare for hearing" }, status: { not: "DONE" } },
        orderBy: { createdAt: "desc" },
      });
      const prepDueDate = subDays(nextScheduledAt, 2) > new Date() ? subDays(nextScheduledAt, 2) : new Date();
      if (prepTask) {
        await tx.task.update({ where: { id: prepTask.id }, data: { dueDate: prepDueDate } });
      }
      await notifyUsers(
        {
          userIds,
          type: NotificationType.HEARING,
          title: `Hearing rescheduled — ${matter.title}`,
          body: `Now set for ${nextScheduledAt.toLocaleString()}.`,
          matterId: existing.matterId,
        },
        tx,
      );
    }

    if (statusChanged) {
      await logActivity(
        {
          action: "updated hearing status",
          entityType: "HEARING",
          entityId: hearing.id,
          matterId: existing.matterId,
          clientId: matter.clientId,
          actorId: actor.id,
          previousValue: existing.status,
          currentValue: data.status,
          source: "WORKFLOW_ENGINE",
        },
        tx,
      );

      if (data.status === HearingStatus.COMPLETED) {
        await notifyUsers(
          {
            userIds,
            type: NotificationType.HEARING,
            title: `Hearing completed — ${matter.title}`,
            body: data.outcome ? `Outcome: ${data.outcome}` : "Outcome pending update.",
            matterId: existing.matterId,
          },
          tx,
        );
      }
    }

    return hearing;
  });

  if (data.status === HearingStatus.COMPLETED) {
    await bumpMatterStageIfEarlier(existing.matterId, matter.stage, MatterStage.ORDER);
  }

  revalidatePath("/", "layout");
  return updated;
}
