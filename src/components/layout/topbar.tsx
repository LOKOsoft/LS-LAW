"use client";

import Link from "next/link";
import * as React from "react";
import {
  Bell,
  Plus,
  UserPlus,
  Briefcase,
  ListChecks,
  Receipt,
  Gavel,
  UploadCloud,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GlobalSearch } from "@/components/shared/global-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { formatTimeAgo, initials } from "@/lib/format";
import { logout } from "@/features/auth/actions";
import { markNotificationRead, markAllNotificationsRead } from "@/features/notifications/actions";
import type { ModuleKey } from "@/lib/constants/nav";
import type { NotificationItem } from "@/features/notifications/queries";

type TopbarProps = {
  firmName: string;
  userName: string;
  userTitle: string;
  notifications: NotificationItem[];
  unreadCount: number;
  basePath: string;
  allowedKeys: ModuleKey[];
};

const ALL_QUICK_ACTIONS: { label: string; icon: typeof Briefcase; key: ModuleKey; path: string }[] = [
  { label: "New Matter", icon: Briefcase, key: "matters", path: "matters?new=1" },
  { label: "New Client", icon: UserPlus, key: "clients", path: "clients?new=1" },
  { label: "New Task", icon: ListChecks, key: "tasks", path: "tasks?new=1" },
  { label: "New Invoice", icon: Receipt, key: "billing", path: "billing?new=1" },
  { label: "Schedule Hearing", icon: Gavel, key: "hearings", path: "hearings?new=1" },
  { label: "Upload Document", icon: UploadCloud, key: "documents", path: "documents?new=1" },
];

export function Topbar({ firmName, userName, userTitle, notifications, unreadCount, basePath, allowedKeys }: TopbarProps) {
  const allowed = new Set(allowedKeys);
  const quickActions = ALL_QUICK_ACTIONS.filter((action) => allowed.has(action.key)).map((action) => ({
    label: action.label,
    icon: action.icon,
    href: `${basePath}/${action.path}`,
  }));
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="hidden shrink-0 flex-col lg:flex">
        <p className="text-sm font-semibold text-foreground">{firmName}</p>
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
      </div>

      <div className="flex flex-1 justify-center lg:justify-start lg:pl-6">
        <GlobalSearch basePath={basePath} allowedKeys={allowedKeys} />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="hidden gap-1.5 sm:inline-flex">
              <Plus className="size-4" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Create new</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {quickActions.map((action) => (
                <DropdownMenuItem key={action.label} asChild>
                  <Link href={action.href}>
                    <action.icon className="size-4 text-muted-foreground" />
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Plus className="size-4" />
        </Button>

        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 ? (
                <form action={markAllNotificationsRead}>
                  <button type="submit" className="text-xs font-medium text-primary hover:underline">
                    Mark all read
                  </button>
                </form>
              ) : null}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
              ) : (
                notifications.map((n) => (
                  <form key={n.id} action={markNotificationRead.bind(null, n.id)}>
                    <button
                      type="submit"
                      className="flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left last:border-0 hover:bg-muted/40"
                    >
                      <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`} />
                      <div className="min-w-0 space-y-0.5">
                        <p className={`text-sm leading-snug ${n.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  </form>
                ))
              )}
            </div>
            <div className="border-t border-border px-4 py-2">
              <Link href={`${basePath}/notifications`} className="text-xs font-medium text-primary hover:underline">
                View all notifications
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border px-1.5 py-1 pr-2 hover:bg-muted/60">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(userName)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-medium">{userName}</p>
                <p className="text-[11px] text-muted-foreground">{userTitle}</p>
              </div>
              <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <div className="px-2 pb-2 text-sm font-medium">{userName}</div>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full">
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
