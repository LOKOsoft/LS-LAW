import { addDays } from "date-fns";
import type { Priority } from "@/generated/prisma/client";

export type DefaultTaskDef = {
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
};

/** Standard opening checklist generated automatically when a matter is created. */
export function buildDefaultMatterTasks(openedDate: Date): DefaultTaskDef[] {
  const offsets: { title: string; description: string; days: number; priority: Priority }[] = [
    { title: "Run conflict of interest check", description: "Screen the client and opposing parties against the firm's existing matters before proceeding.", days: 1, priority: "URGENT" },
    { title: "Send engagement letter", description: "Draft and send the engagement letter for client signature.", days: 2, priority: "HIGH" },
    { title: "Collect client documents", description: "Request and log the documents needed to open the matter file.", days: 5, priority: "MEDIUM" },
    { title: "Initial case research", description: "Complete preliminary research on the practice area and relevant precedent.", days: 7, priority: "MEDIUM" },
  ];
  return offsets.map((o) => ({ title: o.title, description: o.description, dueDate: addDays(openedDate, o.days), priority: o.priority }));
}
