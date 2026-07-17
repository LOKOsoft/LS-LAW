import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loginAs, MANAGING_PARTNER_EMAIL } from "../helpers/login";

test("the matters list has no critical accessibility violations", async ({ page }) => {
  await loginAs(page, MANAGING_PARTNER_EMAIL);
  await page.goto("/managing-partner/matters");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("a matter detail page has no critical accessibility violations", async ({ page }) => {
  await loginAs(page, MANAGING_PARTNER_EMAIL);
  await page.goto("/managing-partner/matters");
  await page.waitForLoadState("networkidle");
  await page.locator("table tbody tr").first().click();
  await page.waitForURL(/\/matters\//, { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
