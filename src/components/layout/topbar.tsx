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
import { Badge } from "@/components/ui/badge";
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
import { roleRoutes } from "@/lib/constants/nav";
import type { RecentActivityItem } from "@/features/activity/queries";

type TopbarProps = {
  firmName: string;
  userName: string;
  userTitle: string;
  notifications: RecentActivityItem[];
};

const quickActions = [
  { label: "New Matter", icon: Briefcase, href: "/managing-partner/matters?new=1" },
  { label: "New Client", icon: UserPlus, href: "/managing-partner/clients?new=1" },
  { label: "New Task", icon: ListChecks, href: "/managing-partner/tasks?new=1" },
  { label: "New Invoice", icon: Receipt, href: "/managing-partner/billing?new=1" },
  { label: "Schedule Hearing", icon: Gavel, href: "/managing-partner/hearings?new=1" },
  { label: "Upload Document", icon: UploadCloud, href: "/managing-partner/documents?new=1" },
];

export function Topbar({ firmName, userName, userTitle, notifications }: TopbarProps) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="hidden shrink-0 flex-col lg:flex">
        <p className="text-sm font-semibold text-foreground">{firmName}</p>
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
      </div>

      <div className="flex flex-1 justify-center lg:justify-start lg:pl-6">
        <GlobalSearch />
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
              {notifications.length > 0 ? (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">Recent activity across the firm</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">No recent activity yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0 hover:bg-muted/40">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[11px]">{initials(n.actor.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{n.actor.name}</span> {n.action}{" "}
                        <span className="font-medium">{n.matter?.title ?? n.client?.name ?? ""}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
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
            <DropdownMenuLabel className="flex items-center justify-between">
              Switch role view
              <Badge variant="secondary" className="font-normal">Phase 1</Badge>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {roleRoutes.map((role) => (
                <DropdownMenuItem key={role.href} asChild>
                  <Link href={role.href}>{role.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <LogOut className="size-4" />
              Sign out (not enabled)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
