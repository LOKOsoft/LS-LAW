import { StickyNote, Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatTimeAgo } from "@/lib/format";
import type { NoteListItem } from "@/features/notes/queries";

export function NotesList({ notes }: { notes: NoteListItem[] }) {
  if (notes.length === 0) {
    return <EmptyState icon={StickyNote} title="No notes yet" description="Internal notes across matters & clients will appear here." />;
  }

  return (
    <div className="space-y-2">
      {notes.map((n) => (
        <Card key={n.id}>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                {n.pinned ? <Pin className="size-3" /> : null}
                {n.author.name}
                <span className="font-normal text-muted-foreground">
                  · {n.matter?.title ?? n.client?.name ?? "Unfiled"}
                </span>
              </span>
              <span>{formatTimeAgo(n.createdAt)}</span>
            </div>
            <p className="mt-1.5 text-sm text-foreground">{n.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
