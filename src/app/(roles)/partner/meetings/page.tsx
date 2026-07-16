import { PageHeader } from "@/components/shared/page-header";
import { MeetingsList } from "@/components/meetings/meetings-list";
import { getMeetings } from "@/features/meetings/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function PartnerMeetingsPage() {
  const user = await requireUser(Role.PARTNER);
  const meetings = await getMeetings({ scopeUserId: user.id });

  return (
    <div>
      <PageHeader title="Meetings" description="Client and internal meetings on your matters." />
      <MeetingsList meetings={meetings} />
    </div>
  );
}
