import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { HR_BASE } from "@/lib/constants/nav";

export default async function HrNotificationsPage() {
  const user = await requireUser(Role.HR);
  const notifications = await getNotifications(user.id, 100);

  return (
    <div>
      <PageHeader title="Notifications" description="People-operations alerts." />
      <NotificationsList notifications={notifications} basePath={HR_BASE} />
    </div>
  );
}
