import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loginAs, MANAGING_PARTNER_EMAIL } from "../helpers/login";

test("the document generator has no critical accessibility violations", async ({ page }) => {
  await loginAs(page, MANAGING_PARTNER_EMAIL);
  await page.goto("/managing-partner/document-generator");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("the generate-document dialog has no critical accessibility violations", async ({ page }) => {
  await loginAs(page, MANAGING_PARTNER_EMAIL);
  await page.goto("/managing-partner/document-generator");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /generate document/i }).click();
  await page.waitForTimeout(300);

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
