import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getFirm } from "@/features/firm/queries";
import { getNotifications, getUnreadNotificationCount } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { RECEPTION_BASE, RECEPTION_MODULE_KEYS } from "@/lib/constants/nav";

export default async function ReceptionLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(Role.RECEPTION);
  const [firm, notifications, unreadCount] = await Promise.all([
    getFirm(),
    getNotifications(user.id, 8),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar basePath={RECEPTION_BASE} allowedKeys={RECEPTION_MODULE_KEYS} roleLabel="Reception" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          firmName={firm.name}
          userName={user.name}
          userTitle={user.title ?? "Reception"}
          notifications={notifications}
          unreadCount={unreadCount}
          basePath={RECEPTION_BASE}
          allowedKeys={RECEPTION_MODULE_KEYS}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
