import type { LogEntry, LogProvider } from "@/lib/platform/logging/types";

const CONSOLE_METHOD: Record<LogEntry["level"], "debug" | "info" | "warn" | "error"> = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

/** Default log sink — structured JSON to stdout/stderr. Fine for a single local process; a real deployment would tail this or swap in `cloud-log-provider-placeholder.ts`. */
export class ConsoleLogProvider implements LogProvider {
  write(entry: LogEntry): void {
    const method = CONSOLE_METHOD[entry.level];
    console[method](JSON.stringify(entry));
  }
}
