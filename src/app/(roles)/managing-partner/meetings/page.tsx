import { PageHeader } from "@/components/shared/page-header";
import { MeetingsList } from "@/components/meetings/meetings-list";
import { getMeetings } from "@/features/meetings/queries";

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  return (
    <div>
      <PageHeader title="Meetings" description="Client and internal meetings across the firm." />
      <MeetingsList meetings={meetings} />
    </div>
  );
}
