"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, GitMerge, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientStatusPill } from "@/components/shared/status-pill";
import { MergeClientDialog } from "@/components/clients/merge-client-dialog";
import type { DuplicateClientGroup } from "@/features/clients/queries";

const REASON_LABEL: Record<DuplicateClientGroup["reason"], string> = {
  name: "Matching name",
  email: "Matching email",
  phone: "Matching phone",
};

export function DuplicateDetectionView({
  groups,
  currentUserId,
  basePath = "/managing-partner",
}: {
  groups: DuplicateClientGroup[];
  currentUserId: string;
  basePath?: string;
}) {
  const [mergeGroupKey, setMergeGroupKey] = React.useState<string | null>(null);
  const [primaryId, setPrimaryId] = React.useState<Record<string, string>>({});

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No duplicates detected"
        description="LEXORA compares client name, email, and phone across the active client base. Nothing matched — the client list looks clean."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {groups.length} possible duplicate {groups.length === 1 ? "group" : "groups"} found across active clients.
      </p>
      {groups.map((group) => {
        const groupId = `${group.reason}:${group.key}`;
        const primary = primaryId[groupId] ?? group.clients[0].id;
        const primaryClient = group.clients.find((c) => c.id === primary) ?? group.clients[0];

        return (
          <Card key={groupId}>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <div className="flex items-center gap-2">
                <Copy className="size-4 text-muted-foreground" />
                <Badge variant="secondary">{REASON_LABEL[group.reason]}</Badge>
                <span className="text-sm text-muted-foreground">{group.clients.length} clients</span>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setMergeGroupKey(groupId)}>
                <GitMerge className="size-4" />
                Review &amp; merge
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.clients.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 px-3 py-2"
                >
                  <div className="min-w-0">
                    <Link href={`${basePath}/clients/${client.id}`} className="truncate text-sm font-medium text-foreground hover:underline">
                      {client.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {client.clientNumber} · {client.email ?? "no email"} · {client.phone ?? "no phone"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ClientStatusPill status={client.status} />
                    <Button
                      size="sm"
                      variant={client.id === primary ? "default" : "outline"}
                      onClick={() => setPrimaryId((prev) => ({ ...prev, [groupId]: client.id }))}
                    >
                      {client.id === primary ? "Keeping this one" : "Keep this one"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            {mergeGroupKey === groupId ? (
              <MergeClientDialog
                open
                onOpenChange={(open) => !open && setMergeGroupKey(null)}
                primaryClient={primaryClient}
                candidates={group.clients}
                currentUserId={currentUserId}
                basePath={basePath}
              />
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
