"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { MatterStatus, MatterTeamRole } from "@/generated/prisma/client";
import { createMatterSchema, type CreateMatterInput } from "@/features/matters/schema";

export async function createMatter(input: CreateMatterInput) {
  const data = createMatterSchema.parse(input);

  const count = await prisma.matter.count();
  const year = new Date().getFullYear();
  const matterNumber = `LEX-${year}-${String(count + 1).padStart(4, "0")}`;

  const matter = await prisma.matter.create({
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
    },
  });

  await prisma.matterTeamMember.create({
    data: { matterId: matter.id, userId: data.responsibleAttorneyId, role: MatterTeamRole.LEAD },
  });

  await prisma.activityLog.create({
    data: {
      action: "created a new matter",
      entityType: "MATTER",
      entityId: matter.id,
      matterId: matter.id,
      clientId: data.clientId,
      actorId: data.responsibleAttorneyId,
    },
  });

  revalidatePath("/managing-partner/matters");
  revalidatePath("/managing-partner");
  return matter;
}
