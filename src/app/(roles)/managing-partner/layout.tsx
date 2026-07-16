import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getFirm, getManagingPartner } from "@/features/firm/queries";
import { getRecentActivity } from "@/features/activity/queries";

export default async function ManagingPartnerLayout({ children }: { children: React.ReactNode }) {
  const [firm, partner, notifications] = await Promise.all([
    getFirm(),
    getManagingPartner(),
    getRecentActivity(8),
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          firmName={firm.name}
          userName={partner.name}
          userTitle={partner.title ?? "Managing Partner"}
          notifications={notifications}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
