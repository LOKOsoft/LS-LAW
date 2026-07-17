# Platform layer

This tree holds **future-SaaS scaffolding**: interfaces and default local/mock
implementations for capabilities LEXORA doesn't need yet (multi-tenancy,
billing, cloud storage, external notifications, AI, pluggable auth) but will
if this app is ever sold as a hosted product instead of run locally by one
firm.

## Rules

1. **Nothing here is wired in as a hard dependency.** The app must keep
   working with zero external services if every file under here vanished
   except the `local`/`memory`/`mock` default implementations.
2. **Don't duplicate real working code.** `src/lib/auth/*`, `src/lib/storage/local-storage.ts`,
   `src/lib/services/notifications.ts`, and `src/features/*/{queries,actions}.ts`
   are the real, working implementations. Modules in here either wrap them
   (storage, notifications' in-app channel) or describe a capability that
   doesn't exist in the app at all yet (billing, AI, tenancy, other
   notification channels) — see each module's own file for which case it is.
3. **Everything is provider-selected via `config/app-config.ts`**, defaulting
   to the local/no-op provider. Swapping to a real provider later should be a
   config + one new adapter file, not a rewrite of call sites.
4. One folder per capability: `types.ts` (the interface contract) +
   `<provider>-adapter.ts` / `<provider>-provider.ts` files + `index.ts`
   (factory that reads config and returns the active implementation).

## What's real vs. mock right now

| Capability | Real implementation used today | What's mocked/inert |
|---|---|---|
| Auth | `src/lib/auth/*` (scrypt + DB sessions) | `auth/` here only adds read-only interfaces + a permission-check facade over the existing role/permission-matrix data — it does not replace `requireUser()`/`dal.ts`. |
| Storage | `src/lib/storage/local-storage.ts` (filesystem) | `storage/` wraps it behind `StorageProvider`; cloud adapters throw `ProviderNotConfiguredError` if ever selected. |
| Notifications | `src/lib/services/notifications.ts` (in-app `Notification` rows) | `notifications/` wraps that as the `in-app` channel (only one enabled by default); email/SMS/WhatsApp/push/desktop channels log to console and are disabled by default. |
| Multi-tenancy | Single `Firm` row (see `prisma/schema.prisma`) | `tenancy/` resolves everything to that one firm; nothing partitions data by tenant yet. |
| Billing/subscriptions | N/A — doesn't exist | Fully mock; `FeatureGate` always returns `true` (all features unlocked locally). |
| AI | N/A — doesn't exist | Fully mock, deterministic canned responses — no network calls. |
| Caching | N/A — queries hit Prisma directly | In-memory TTL cache, unused by default; opt-in per call site. |
| Logging | `src/lib/services/activity.ts` (`ActivityLog` — the business audit trail) | `logging/` is a separate *operational* logger (console by default) for app/perf/error/security events — it is not a replacement for `ActivityLog` and must not be used for business audit records. |

See `docs/FUTURE_INTEGRATIONS.md` for how to actually swap a provider when this becomes a hosted product.
