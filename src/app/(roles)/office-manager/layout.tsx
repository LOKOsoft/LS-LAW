import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getFirm } from "@/features/firm/queries";
import { getNotifications, getUnreadNotificationCount } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { OFFICE_MANAGER_BASE, OFFICE_MANAGER_MODULE_KEYS } from "@/lib/constants/nav";

export default async function OfficeManagerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(Role.OFFICE_MANAGER);
  const [firm, notifications, unreadCount] = await Promise.all([
    getFirm(),
    getNotifications(user.id, 8),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar basePath={OFFICE_MANAGER_BASE} allowedKeys={OFFICE_MANAGER_MODULE_KEYS} roleLabel="Office Manager" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          firmName={firm.name}
          userName={user.name}
          userTitle={user.title ?? "Office Manager"}
          notifications={notifications}
          unreadCount={unreadCount}
          basePath={OFFICE_MANAGER_BASE}
          allowedKeys={OFFICE_MANAGER_MODULE_KEYS}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
