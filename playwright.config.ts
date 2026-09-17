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
    : {
        command: "npx astro preview --port 4321",
        port: 4321,
        reuseExistingServer: true,
        // Astro detects a coding agent driving the terminal and auto-detaches
        // `preview` into a background daemon, which makes Playwright see the
        // launched process exit immediately ("Process from config.webServer
        // exited early."). Despite its name, setting this to any non-empty
        // value SUPPRESSES that auto-detach and keeps preview in the
        // foreground, which is what webServer needs.
        env: { ASTRO_PREVIEW_BACKGROUND: "1" },
      },
  projects: [
    { name: "Galaxy S9+", use: { ...devices["Galaxy S9+"] } },
    ...(MATRIX
      ? [
          // devices["iPhone SE"]/["iPhone 14"] carry defaultBrowserType: "webkit",
          // and Playwright's own WebKit build does not link on NixOS for the same
          // reason its Chromium build does not (see CHROMIUM_PATH above) — so
          // these two are pinned to chromium explicitly, keeping every other
          // device field (viewport, deviceScaleFactor, userAgent, isMobile,
          // hasTouch). This buys viewport coverage at 320px and 390px only.
          // iOS Safari's actual rendering engine is NEVER exercised by this
          // matrix, on this machine or in CI: no amount of Chromium at an
          // iPhone's viewport checks WebKit-specific behaviour (Safari's own
          // handling of `env(safe-area-inset-*)`, for one — BaseLayout and the
          // sticky call bar depend on it). The project's Definition of Done
          // already relies on a human looking at one real iPhone 14 screenshot
          // for precisely that reason; that step stays necessary regardless of
          // what runs green here.
          { name: "iPhone SE", testMatch: LAYOUT_SPECS, use: { ...devices["iPhone SE"], defaultBrowserType: "chromium" as const } },
          { name: "iPhone 14", testMatch: LAYOUT_SPECS, use: { ...devices["iPhone 14"], defaultBrowserType: "chromium" as const } },
          { name: "Pixel 7", testMatch: LAYOUT_SPECS, use: { ...devices["Pixel 7"] } },
          { name: "Desktop", testMatch: LAYOUT_SPECS, use: { ...devices["Desktop Chrome"] } },
        ]
      : []),
  ],
});
