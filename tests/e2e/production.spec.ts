// tests/e2e/production.spec.ts
// Runs against the deployed site only. It never names a member: production
// contains real people and this file is public.
import { expect, test } from "@playwright/test";

const BASE = process.env.URL_PROD;
test.skip(!BASE, "URL_PROD is not set");

test("Serves the directory over HTTPS, with a working search index", async ({ page, request }) => {
  const response = await page.goto(BASE!);
  expect(response!.status()).toBe(200);
  expect(page.url()).toMatch(/^https:/);

  expect((await request.get(`${BASE}/annuaire`)).status()).toBe(200);

  const index = await request.get(`${BASE}/recherche.json`);
  expect(index.status()).toBe(200);
  const entries = (await index.json()) as unknown[];
  expect(entries.length).toBeGreaterThan(0);
  expect(JSON.stringify(entries)).not.toContain("@"); // no contact details, in production too
});

test("Sets no cookie and sends the headers it promises", async ({ page, context }) => {
  // Registered BEFORE the navigation: the beacon may answer while goto is still
  // resolving, and a wait started afterwards would hang until the timeout.
  const beacon = page.waitForResponse((r) => r.url().includes("cloudflareinsights.com"));
  const response = await page.goto(BASE!);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // The beacon is the only third-party request the site makes; waiting for it
  // proves analytics is live before asserting that it still sets no cookie.
  await beacon;
  expect(await context.cookies()).toHaveLength(0);

  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("script-src 'self'");
  expect(headers["strict-transport-security"]).toContain("max-age=31536000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});
