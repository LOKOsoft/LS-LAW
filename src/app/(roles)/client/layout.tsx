import { Scale, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { requirePortalUser } from "@/lib/auth/dal";
import { getFirm } from "@/features/firm/queries";
import { logout } from "@/features/auth/actions";
import { initials } from "@/lib/format";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PortalTabsNav } from "@/components/client-portal/portal-tabs-nav";

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const [{ user, client }, firm] = await Promise.all([requirePortalUser(), getFirm()]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scale className="size-4.5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">{firm.name}</p>
              <p className="text-xs text-muted-foreground">Client Portal · {client.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <form action={logout}>
              <button type="submit" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
        <PortalTabsNav />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
