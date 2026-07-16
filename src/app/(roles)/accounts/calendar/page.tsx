import { PageHeader } from "@/components/shared/page-header";
import { FullCalendar } from "@/components/calendar/full-calendar";
import { getCalendarEvents } from "@/features/calendar/queries";

export default async function AccountsCalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div>
      <PageHeader title="Calendar" description="Firm-wide schedule — billing deadlines and meetings." />
      <FullCalendar events={events} />
    </div>
  );
}
