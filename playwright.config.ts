import { defineConfig, devices } from "@playwright/test";

/**
 * Covers e2e, accessibility, performance, and visual-regression tests — they
 * all drive a real browser against the real dev server, just with different
 * assertions (see tests/e2e, tests/accessibility, tests/performance, tests/visual).
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/**/*.spec.ts", "accessibility/**/*.spec.ts", "performance/**/*.spec.ts", "visual/**/*.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  // Generous — Next dev mode compiles each route tree on first hit (Turbopack
  // cold compile), which can take several seconds and isn't a real regression.
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
