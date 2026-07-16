import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { OFFICE_MANAGER_BASE } from "@/lib/constants/nav";

export default async function OfficeManagerNotificationsPage() {
  const user = await requireUser(Role.OFFICE_MANAGER);
  const notifications = await getNotifications(user.id, 100);

  return (
    <div>
      <PageHeader title="Notifications" description="Office operations alerts." />
      <NotificationsList notifications={notifications} basePath={OFFICE_MANAGER_BASE} />
    </div>
  );
}
