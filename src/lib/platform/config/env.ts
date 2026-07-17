/** Typed, defaulted env var reads. Centralizing this means adding a real env var later (e.g. STRIPE_SECRET_KEY) touches one file, not every call site. */

function readString(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

function readOptionalString(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function readBool(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1" || value === "yes";
}

export const env = {
  nodeEnv: readString("NODE_ENV", "development"),
  isProduction: process.env.NODE_ENV === "production",

  // Multi-tenancy — off by default; see tenancy/README notes in platform/README.md.
  multiTenancyEnabled: readBool("LEXORA_MULTI_TENANCY_ENABLED", false),

  // Storage provider selection — "local" is the only one with a real backing implementation today.
  storageProvider: readString("LEXORA_STORAGE_PROVIDER", "local") as "local" | "s3" | "azure-blob" | "gcs",

  // Notification channels — comma-separated list of enabled channels; "in-app" is the only real one.
  notificationChannels: readString("LEXORA_NOTIFICATION_CHANNELS", "in-app"),

  // AI provider selection — "mock" is the only implemented one; named providers are inert placeholders.
  aiProvider: readString("LEXORA_AI_PROVIDER", "mock") as "mock" | "openai" | "anthropic" | "gemini",

  // Billing/payment provider selection — "mock" is the only implemented one.
  paymentProvider: readString("LEXORA_PAYMENT_PROVIDER", "mock") as "mock" | "stripe" | "razorpay",

  // Caching backend — "memory" is the only implemented one.
  cacheProvider: readString("LEXORA_CACHE_PROVIDER", "memory") as "memory" | "redis",

  // Logging sink — "console" is the only implemented one.
  logProvider: readString("LEXORA_LOG_PROVIDER", "console") as "console" | "cloud",
  logLevel: readString("LEXORA_LOG_LEVEL", "info") as "debug" | "info" | "warn" | "error",

  // Regional/branding defaults — used by app-config.ts, overridable per env.
  defaultLocale: readString("LEXORA_DEFAULT_LOCALE", "en-IN"),
  defaultCurrency: readString("LEXORA_DEFAULT_CURRENCY", "INR"),
  defaultTimezone: readString("LEXORA_DEFAULT_TIMEZONE", "Asia/Kolkata"),
  appBaseUrl: readOptionalString("LEXORA_APP_BASE_URL"),

  // Placeholders read but unused until a real provider is wired in — kept here so
  // the shape future integrations need already exists in one place.
  stripeSecretKey: readOptionalString("STRIPE_SECRET_KEY"),
  razorpayKeyId: readOptionalString("RAZORPAY_KEY_ID"),
  openaiApiKey: readOptionalString("OPENAI_API_KEY"),
  anthropicApiKey: readOptionalString("ANTHROPIC_API_KEY"),
  s3BucketName: readOptionalString("LEXORA_S3_BUCKET"),
  redisUrl: readOptionalString("REDIS_URL"),
};
