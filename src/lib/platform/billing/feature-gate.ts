import { appConfig } from "@/lib/platform/config";
import type { FeatureGate } from "@/lib/platform/billing/types";

/** Locally, every feature is unlocked — there's no plan enforcement without a real payment provider behind it. Once billing is real, this becomes a lookup against the tenant's active `Subscription` → `Plan.features`. */
export class LocalFeatureGate implements FeatureGate {
  async isEnabled(): Promise<boolean> {
    return !appConfig.features.billing;
  }
}

export const featureGate: FeatureGate = new LocalFeatureGate();
