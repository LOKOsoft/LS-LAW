"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Star, Eye, FilePlus2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/format";
import { toggleTemplateFavorite } from "@/features/templates/actions";
import type { TemplateItem } from "@/features/templates/queries";

export function TemplateCard({ template }: { template: TemplateItem }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = React.useState(template.isFavorite);
  const [isPending, setIsPending] = React.useState(false);

  async function handleToggleFavorite() {
    setIsPending(true);
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      await toggleTemplateFavorite(template.id, next);
      router.refresh();
    } catch {
      setIsFavorite(!next);
      toast.error("Could not update favourite");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="gap-3 py-4">
      <CardContent className="space-y-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{template.name}</p>
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={isPending}
            className="shrink-0 text-muted-foreground hover:text-warning"
            aria-label="Toggle favourite"
          >
            <Star className={cn("size-4", isFavorite && "fill-warning text-warning")} />
          </button>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{template.usageCount} uses</span>
          <span>{template.lastUsedAt ? `Used ${formatTimeAgo(template.lastUsedAt)}` : "Never used"}</span>
        </div>
        <div className="flex gap-2 border-t border-border/60 pt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => toast.info("Preview coming soon", { description: template.name })}
          >
            <Eye className="size-3.5" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => toast.info("Document generation coming soon", { description: `Generate from "${template.name}"` })}
          >
            <FilePlus2 className="size-3.5" />
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
