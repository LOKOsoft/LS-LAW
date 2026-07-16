import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { RECEPTION_BASE } from "@/lib/constants/nav";

export default async function ReceptionNotificationsPage() {
  const user = await requireUser(Role.RECEPTION);
  const notifications = await getNotifications(user.id, 100);

  return (
    <div>
      <PageHeader title="Notifications" description="Alerts relevant to front-desk operations." />
      <NotificationsList notifications={notifications} basePath={RECEPTION_BASE} />
    </div>
  );
}
