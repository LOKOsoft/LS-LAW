import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { ADMINISTRATOR_BASE } from "@/lib/constants/nav";

export default async function NotificationsPage() {
  const user = await requireUser(Role.ADMINISTRATOR);
  const notifications = await getNotifications(user.id, 100);

  return (
    <div>
      <PageHeader title="Notifications" description="Alerts relevant to you across matters, deadlines, and billing." />
      <NotificationsList notifications={notifications} basePath={ADMINISTRATOR_BASE} />
    </div>
  );
}
