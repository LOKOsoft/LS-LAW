export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Operational log categories. Distinct from `ActivityLog` (the business audit
 * trail in `src/lib/services/activity.ts`) — "security" here means auth/permission
 * events for ops visibility, not the client-facing matter/document timeline.
 */
export type LogCategory = "app" | "performance" | "error" | "security";

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
};

export interface LogProvider {
  write(entry: LogEntry): void;
}
