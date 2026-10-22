// tests/e2e/deployed.spec.ts
// Runs against a deployed site only — staging or production, right after the
// deploy job uploads it. It never names a member: both contain real people
// and this file is public.
import { expect, test } from "@playwright/test";

const BASE = process.env.URL_DEPLOYED;
test.skip(!BASE, "URL_DEPLOYED is not set");

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
  //
  // Matches the RUM POST itself (final-fixes-report.md, M21), not the script's
  // own GET: the script loads and this URL matches even with a wrong or empty
  // beacon token (CI's own vars.PUBLIC_CF_BEACON_TOKEN unset) — "loads, runs,
  // counts nothing" would still pass green. Only the POST, and it succeeding,
  // proves analytics actually recorded the visit.
  const beacon = page.waitForResponse(
    (r) => r.request().method() === "POST" && r.url().includes("/cdn-cgi/rum"),
  );
  const response = await page.goto(BASE!);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const beaconResponse = await beacon;
  expect(beaconResponse.ok()).toBe(true);
  expect(await context.cookies()).toHaveLength(0);

  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("script-src 'self'");
  expect(headers["strict-transport-security"]).toContain("max-age=31536000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});
