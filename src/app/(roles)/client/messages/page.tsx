import { MessageSquare, Mail, Phone, Users, FileSignature, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/format";
import { requirePortalUser } from "@/lib/auth/dal";
import { getPortalMessages } from "@/features/client-portal/queries";

const communicationIcon = { EMAIL: Mail, CALL: Phone, MEETING: Users, LETTER: FileSignature, SMS: MessageCircle } as const;

export default async function ClientPortalMessagesPage() {
  const { client } = await requirePortalUser();
  const logs = await getPortalMessages(client.id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">Communication history between you and the firm.</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages yet" description="Communication with the firm will appear here." />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const Icon = communicationIcon[log.type];
            return (
              <Card key={log.id}>
                <CardContent className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{log.subject}</p>
                    <p className="text-xs text-muted-foreground">{log.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {log.loggedBy.name} · {formatDate(log.occurredAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
