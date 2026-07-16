"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { TaskStatus } from "@/generated/prisma/client";
import { createTaskSchema, type CreateTaskInput } from "@/features/tasks/schema";
import { requireUser } from "@/lib/auth/dal";

export async function createTask(input: CreateTaskInput) {
  const data = createTaskSchema.parse(input);
  const creator = await requireUser();

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      matterId: data.matterId || null,
      assigneeId: data.assigneeId,
      createdById: creator.id,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  revalidatePath("/", "layout");
  return task;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status, completedAt: status === TaskStatus.DONE ? new Date() : null },
  });
  revalidatePath("/", "layout");
}
