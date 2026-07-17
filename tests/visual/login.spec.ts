import { test, expect } from "@playwright/test";

/**
 * First run creates the baseline screenshot (`login.spec.ts-snapshots/`);
 * commit it. Subsequent runs diff against that baseline — a failure here
 * means the login page's visual appearance changed, intentionally or not.
 */
test("login page visual baseline", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveScreenshot("login-page.png", { maxDiffPixelRatio: 0.02 });
});
