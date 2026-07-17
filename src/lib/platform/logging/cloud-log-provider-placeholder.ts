import type { LogEntry, LogProvider } from "@/lib/platform/logging/types";
import { ConsoleLogProvider } from "@/lib/platform/logging/console-log-provider";

/**
 * Stands in for a future shipped-logs provider (Datadog, CloudWatch, Better Stack, etc.).
 * Selecting `LEXORA_LOG_PROVIDER=cloud` today just falls back to console output with a
 * one-time warning — there is no real network log shipping yet, by design (zero external
 * services locally). Replace the body of `write()` with a real SDK call when this app is
 * actually deployed as a hosted service.
 */
export class CloudLogProviderPlaceholder implements LogProvider {
  private readonly fallback = new ConsoleLogProvider();
  private warned = false;

  write(entry: LogEntry): void {
    if (!this.warned) {
      this.fallback.write({
        timestamp: new Date().toISOString(),
        level: "warn",
        category: "app",
        message: "LEXORA_LOG_PROVIDER=cloud selected but no cloud log provider is configured — falling back to console.",
      });
      this.warned = true;
    }
    this.fallback.write(entry);
  }
}
