import { prisma } from "@/lib/db/prisma";

export async function getCalendarEvents() {
  const [hearings, meetings, tasks] = await Promise.all([
    prisma.hearing.findMany({ include: { matter: { select: { title: true } } } }),
    prisma.meeting.findMany({ include: { client: { select: { name: true } }, matter: { select: { title: true } } } }),
    prisma.task.findMany({ where: { dueDate: { not: null } }, include: { assignee: { select: { name: true } } } }),
  ]);

  const events = [
    ...hearings.map((h) => ({
      id: `hearing-${h.id}`,
      type: "hearing" as const,
      date: h.scheduledAt,
      title: `${h.hearingType} — ${h.matter.title}`,
      meta: h.courtName,
    })),
    ...meetings.map((m) => ({
      id: `meeting-${m.id}`,
      type: "meeting" as const,
      date: m.scheduledAt,
      title: m.title,
      meta: m.client?.name ?? m.matter?.title ?? "",
    })),
    ...tasks.map((t) => ({
      id: `task-${t.id}`,
      type: "task" as const,
      date: t.dueDate as Date,
      title: t.title,
      meta: t.assignee.name,
    })),
  ];

  return events;
}

export type CalendarEvent = Awaited<ReturnType<typeof getCalendarEvents>>[number];
