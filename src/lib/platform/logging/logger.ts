import { appConfig } from "@/lib/platform/config";
import type { LogCategory, LogLevel, LogProvider } from "@/lib/platform/logging/types";
import { ConsoleLogProvider } from "@/lib/platform/logging/console-log-provider";
import { CloudLogProviderPlaceholder } from "@/lib/platform/logging/cloud-log-provider-placeholder";

const LEVEL_WEIGHT: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function resolveProvider(): LogProvider {
  return appConfig.providers.log === "cloud" ? new CloudLogProviderPlaceholder() : new ConsoleLogProvider();
}

class Logger {
  private provider: LogProvider = resolveProvider();
  private readonly minLevel = appConfig.logLevel;

  private write(level: LogLevel, category: LogCategory, message: string, context?: Record<string, unknown>, error?: unknown) {
    if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[this.minLevel]) return;
    this.provider.write({
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: appConfig.isProduction ? undefined : error.stack }
          : undefined,
    });
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.write("debug", "app", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.write("info", "app", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.write("warn", "app", message, context);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.write("error", "error", message, context, error);
  }

  /** Timing/throughput signal — e.g. `logger.performance("matters.query", { durationMs: 42 })`. */
  performance(message: string, context?: Record<string, unknown>) {
    this.write("info", "performance", message, context);
  }

  /** Ops-level security events (failed login, permission denial) — not the client-facing ActivityLog audit trail. */
  security(message: string, context?: Record<string, unknown>) {
    this.write("warn", "security", message, context);
  }
}

export const logger = new Logger();
