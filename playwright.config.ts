import { defineConfig, devices } from "@playwright/test";

// Galaxy S9+ (360 px) is the floor and the default: every assertion runs once,
// on one device, unless the assertion is about the device (docs/STANDARDS.md §2).
// MATRIX=1 adds the other four for the layout-sensitive specs only, before deploy.
const MATRIX = process.env.MATRIX === "1";
const LAYOUT_SPECS = /(landing|profile|carte|a11y)\.spec\.ts$/;

// Playwright's own Chromium download does not link on NixOS (no FHS /usr/lib for
// its shared libraries). CI installs the real thing via `playwright install
// --with-deps` and is unaffected; a NixOS developer instead exports
// PLAYWRIGHT_CHROMIUM_PATH to point at the system browser (see CLAUDE.md).
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: "tests/e2e",
  retries: 0,          // flaky tests are deleted, never retried or quarantined
  use: {
    baseURL: "http://localhost:4321",
    ...(CHROMIUM_PATH ? { launchOptions: { executablePath: CHROMIUM_PATH } } : {}),
  },
  // No local server when the target is production: the smoke job checks out and
  // runs `playwright test tests/e2e/production.spec.ts` with no dist/ to serve,
  // and an unconditional webServer aborts the run before the skip guard fires.
  webServer: process.env.URL_PROD
    ? undefined
    : { command: "npx astro preview --port 4321", port: 4321, reuseExistingServer: true },
  projects: [
    { name: "Galaxy S9+", use: { ...devices["Galaxy S9+"] } },
    ...(MATRIX
      ? [
          { name: "iPhone SE", testMatch: LAYOUT_SPECS, use: { ...devices["iPhone SE"] } },
          { name: "iPhone 14", testMatch: LAYOUT_SPECS, use: { ...devices["iPhone 14"] } },
          { name: "Pixel 7", testMatch: LAYOUT_SPECS, use: { ...devices["Pixel 7"] } },
          { name: "Desktop", testMatch: LAYOUT_SPECS, use: { ...devices["Desktop Chrome"] } },
        ]
      : []),
  ],
});
