import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the login page has no critical accessibility violations", async ({ page }) => {
  await page.goto("/login");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
