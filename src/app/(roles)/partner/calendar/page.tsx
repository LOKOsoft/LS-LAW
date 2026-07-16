import { PageHeader } from "@/components/shared/page-header";
import { FullCalendar } from "@/components/calendar/full-calendar";
import { getCalendarEvents } from "@/features/calendar/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function PartnerCalendarPage() {
  const user = await requireUser(Role.PARTNER);
  const events = await getCalendarEvents({ scopeUserId: user.id });

  return (
    <div>
      <PageHeader title="Calendar" description="Your schedule — hearings, meetings, and task deadlines." />
      <FullCalendar events={events} />
    </div>
  );
}
