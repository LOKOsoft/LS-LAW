"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { LeaveStatus } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/dal";

export async function decideLeaveRequest(leaveId: string, status: LeaveStatus) {
  const approver = await requireUser();
  await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status, approvedById: approver.id },
  });
  revalidatePath("/", "layout");
}
