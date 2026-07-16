import { PageHeader } from "@/components/shared/page-header";
import { FullCalendar } from "@/components/calendar/full-calendar";
import { getCalendarEvents } from "@/features/calendar/queries";

export default async function OfficeManagerCalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div>
      <PageHeader title="Calendar" description="Firm-wide schedule for office coordination." />
      <FullCalendar events={events} />
    </div>
  );
}
