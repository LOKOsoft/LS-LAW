"use server";

import { prisma } from "@/lib/db/prisma";
import { getAIProvider, AIPipeline } from "@/lib/platform/ai";
import { requireUser } from "@/lib/auth/dal";

/**
 * The Matter Assistant (Step 7): real data (pending tasks, deadlines, risks,
 * timeline) is computed directly from already-loaded matter data by the
 * caller — see `components/matters/matter-detail-tabs.tsx`'s "Risks" tab and
 * `features/timeline/build-matter-timeline.ts`. This file covers only the
 * two capabilities that genuinely need narrative language generation
 * (summarizing, meeting briefs) — routed through the real `AIPipeline` +
 * prompt registry from `lib/platform/ai`, currently answered by
 * `MockAIProvider`'s canned responses until a real local/cloud provider is
 * configured. Exposed as Server Actions (not plain query functions) so a
 * Client Component can call them directly without bundling
 * Prisma/better-sqlite3 into the browser — see docs/AI_ARCHITECTURE.md.
 */

export async function generateMatterSummary(matterId: string) {
  await requireUser();
  const matter = await prisma.matter.findUniqueOrThrow({
    where: { id: matterId },
    include: {
      client: { select: { name: true } },
      activityLogs: { orderBy: { createdAt: "desc" }, take: 10, include: { actor: { select: { name: true } } } },
    },
  });

  const provider = getAIProvider();
  const recentActivity = matter.activityLogs.map((log) => `${log.actor.name} ${log.action}`);
  return provider.summarizeMatter(matterId, recentActivity);
}

export async function generateMeetingBrief(matterId: string, openItems: string[]) {
  await requireUser();
  const matter = await prisma.matter.findUniqueOrThrow({ where: { id: matterId }, select: { title: true } });
  const pipeline = new AIPipeline(getAIProvider());
  const result = await pipeline.run<string>("matter.meeting-brief", {
    matterTitle: matter.title,
    openItems: openItems.length > 0 ? openItems.join("\n") : "None recorded.",
  });
  return result.parsed;
}
