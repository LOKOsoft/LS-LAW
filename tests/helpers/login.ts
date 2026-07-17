import type { Page } from "@playwright/test";

/** Shared login helper for e2e/accessibility/performance specs that need an authenticated session. Uses a seeded demo user — see README.md's demo credentials table. */
export async function loginAs(page: Page, email: string, password = "Lexora@123") {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  await page.waitForURL(/\/(managing-partner|senior-partner|partner|associate|junior-associate|legal-researcher|paralegal|reception|accounts|hr|office-manager|administrator|client)/, {
    timeout: 15000,
  });
}

export const MANAGING_PARTNER_EMAIL = "arjun.mehta@lexoralaw.com";
