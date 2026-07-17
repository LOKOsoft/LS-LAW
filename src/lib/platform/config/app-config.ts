import { env } from "@/lib/platform/config/env";

export type FeatureFlags = {
  /** Master switch — when false (default), every capability in src/lib/platform falls back to its local/mock provider regardless of individual provider settings. */
  multiTenancy: boolean;
  billing: boolean;
  cloudStorage: boolean;
  externalNotifications: boolean;
  aiAssistant: boolean;
};

export type BrandingConfig = {
  productName: string;
  shortName: string;
  supportEmail: string;
  logoPath: string;
  primaryColorHsl: string;
};

export type RegionalConfig = {
  locale: string;
  currency: string;
  timezone: string;
  dateFormat: string;
};

export type ProviderSelection = {
  storage: "local" | "s3" | "azure-blob" | "gcs";
  ai: "mock" | "openai" | "anthropic" | "gemini";
  payment: "mock" | "stripe" | "razorpay";
  cache: "memory" | "redis";
  log: "console" | "cloud";
};

export type AppConfig = {
  env: typeof env.nodeEnv;
  isProduction: boolean;
  appBaseUrl: string;
  features: FeatureFlags;
  branding: BrandingConfig;
  regional: RegionalConfig;
  providers: ProviderSelection;
  notificationChannels: string[];
  logLevel: "debug" | "info" | "warn" | "error";
};

/**
 * Single source of truth for enterprise-level settings. Every "future
 * integration" module under src/lib/platform reads its provider choice from
 * here instead of touching process.env directly, so enabling a real provider
 * later is a config change (env vars), not a code change.
 */
export const appConfig: AppConfig = {
  env: env.nodeEnv,
  isProduction: env.isProduction,
  appBaseUrl: env.appBaseUrl ?? "http://localhost:3000",
  features: {
    multiTenancy: env.multiTenancyEnabled,
    // These stay false until a real provider is configured, even if LEXORA_*_PROVIDER
    // env vars name one — see providers.* below and each module's index.ts factory.
    billing: false,
    cloudStorage: env.storageProvider !== "local",
    externalNotifications: env.notificationChannels
      .split(",")
      .map((c) => c.trim())
      .some((c) => c && c !== "in-app"),
    aiAssistant: env.aiProvider !== "mock",
  },
  branding: {
    productName: "LEXORA",
    shortName: "LEXORA",
    supportEmail: "support@lexoralaw.com",
    logoPath: "/logo.svg",
    primaryColorHsl: "222 47% 11%",
  },
  regional: {
    locale: env.defaultLocale,
    currency: env.defaultCurrency,
    timezone: env.defaultTimezone,
    dateFormat: "dd MMM yyyy",
  },
  providers: {
    storage: env.storageProvider,
    ai: env.aiProvider,
    payment: env.paymentProvider,
    cache: env.cacheProvider,
    log: env.logProvider,
  },
  notificationChannels: env.notificationChannels
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean),
  logLevel: env.logLevel,
};
