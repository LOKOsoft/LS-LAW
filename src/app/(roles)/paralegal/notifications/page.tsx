import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { PARALEGAL_BASE } from "@/lib/constants/nav";

export default async function ParalegalNotificationsPage() {
  const user = await requireUser(Role.PARALEGAL);
  const notifications = await getNotifications(user.id, 100);

  return (
    <div>
      <PageHeader title="Notifications" description="Alerts relevant to you across your matters." />
      <NotificationsList notifications={notifications} basePath={PARALEGAL_BASE} />
    </div>
  );
}
