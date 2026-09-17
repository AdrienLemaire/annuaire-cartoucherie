// tests/e2e/legal.spec.ts
import { expect, test } from "@playwright/test";

const PAGES = ["/a-propos", "/confidentialite", "/mentions-legales", "/avis"];

test("Every footer link reaches a page with a heading", async ({ page }) => {
  await page.goto("/");
  for (const path of PAGES) {
    await expect(page.locator(`footer a[href="${path}"]`)).toBeVisible();
  }
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
  }
});

// A missing legal detail must stay visibly missing. The failure mode this
// guards against is an agent filling the gap with a plausible invention.
// .first(): the page carries several markers (association name, legal form,
// address, SIRET/RNA, hosting entity), so the bare locator hits Playwright's
// strict-mode rule against multiple matches. Any one of them proves the same
// thing — that a marker, not an invention, is on the page.
test("The legal notice marks what is missing instead of inventing it", async ({ page }) => {
  await page.goto("/mentions-legales");
  await expect(page.getByText(/⟨à compléter/).first()).toBeVisible();
});
