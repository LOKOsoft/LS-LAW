import { PageHeader } from "@/components/shared/page-header";
import { FullCalendar } from "@/components/calendar/full-calendar";
import { getCalendarEvents } from "@/features/calendar/queries";

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div>
      <PageHeader title="Calendar" description="Firm-wide schedule — hearings, meetings, and task deadlines." />
      <FullCalendar events={events} />
    </div>
  );
}
