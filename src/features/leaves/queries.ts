import { prisma } from "@/lib/db/prisma";

export async function getLeaveRequests() {
  return prisma.leaveRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, title: true, avatarUrl: true } },
      approvedBy: { select: { name: true } },
    },
  });
}

export type LeaveRequestItem = Awaited<ReturnType<typeof getLeaveRequests>>[number];
