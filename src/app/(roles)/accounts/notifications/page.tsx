import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { ACCOUNTS_BASE } from "@/lib/constants/nav";

export default async function AccountsNotificationsPage() {
  const user = await requireUser(Role.ACCOUNTS);
  const notifications = await getNotifications(user.id, 100);

  return (
    <div>
      <PageHeader title="Notifications" description="Billing and finance alerts." />
      <NotificationsList notifications={notifications} basePath={ACCOUNTS_BASE} />
    </div>
  );
}
