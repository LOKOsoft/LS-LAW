import { test, expect } from "@playwright/test";

/**
 * A coarse budget, not a micro-benchmark — this catches "someone added a
 * multi-second blocking call to the login page," not small regressions.
 * Tune the threshold if the dev machine running CI is meaningfully slower.
 */
test("the login page responds within a reasonable budget", async ({ page }) => {
  const start = Date.now();
  const response = await page.goto("/login", { waitUntil: "domcontentloaded" });
  const elapsedMs = Date.now() - start;

  expect(response?.status()).toBe(200);
  expect(elapsedMs).toBeLessThan(5000);
});
