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

