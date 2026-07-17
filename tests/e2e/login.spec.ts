import { test, expect } from "@playwright/test";

// Uses a seeded demo user (see README.md's demo credentials table) — run
// `npm run db:seed` at least once before running e2e tests.
test.describe("login", () => {
  test("a seeded user can log in and land on their role home", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("arjun.mehta@lexoralaw.com");
    await page.getByLabel(/password/i).fill("Lexora@123");
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    await expect(page).toHaveURL(/\/managing-partner/);
  });

  test("an invalid password shows an error and stays on /login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("arjun.mehta@lexoralaw.com");
    await page.getByLabel(/password/i).fill("wrong-password");
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });
});
