import { startOfDay, endOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/db/prisma";

export async function getRecentAttendance(days = 15) {
  return prisma.attendanceRecord.findMany({
    where: { date: { gte: subDays(new Date(), days) } },
    orderBy: [{ date: "desc" }, { user: { name: "asc" } }],
    include: { user: { select: { id: true, name: true, title: true, avatarUrl: true } } },
  });
}

export type AttendanceListItem = Awaited<ReturnType<typeof getRecentAttendance>>[number];

export async function getTodayAttendanceSummary() {
  const today = new Date();
  const records = await prisma.attendanceRecord.findMany({
    where: { date: { gte: startOfDay(today), lte: endOfDay(today) } },
  });
  const totalStaff = await prisma.user.count({ where: { status: "ACTIVE" } });
  const present = records.filter((r) => r.status === "PRESENT" || r.status === "WORK_FROM_HOME").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const onLeave = records.filter((r) => r.status === "ON_LEAVE").length;
  return { totalStaff, present, absent, onLeave, notMarked: Math.max(0, totalStaff - records.length) };
}
