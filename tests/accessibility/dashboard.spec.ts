import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loginAs, MANAGING_PARTNER_EMAIL } from "../helpers/login";

test("the dashboard has no critical accessibility violations", async ({ page }) => {
  await loginAs(page, MANAGING_PARTNER_EMAIL);
  // StatCard's entrance animation (framer-motion fade/slide-in) briefly renders at
  // partial opacity; without this wait, axe can catch it mid-transition and report a
  // spurious low-contrast violation that has nothing to do with the settled design.
  await page.waitForTimeout(800);

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
