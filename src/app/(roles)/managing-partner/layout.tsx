import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getFirm } from "@/features/firm/queries";
import { getNotifications, getUnreadNotificationCount } from "@/features/notifications/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";
import { ALL_MODULE_KEYS, MANAGING_PARTNER_BASE } from "@/lib/constants/nav";

export default async function ManagingPartnerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(Role.MANAGING_PARTNER);
  const [firm, notifications, unreadCount] = await Promise.all([
    getFirm(),
    getNotifications(user.id, 8),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar basePath={MANAGING_PARTNER_BASE} allowedKeys={ALL_MODULE_KEYS} roleLabel="Managing Partner" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          firmName={firm.name}
          userName={user.name}
          userTitle={user.title ?? "Managing Partner"}
          notifications={notifications}
          unreadCount={unreadCount}
          basePath={MANAGING_PARTNER_BASE}
          allowedKeys={ALL_MODULE_KEYS}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
