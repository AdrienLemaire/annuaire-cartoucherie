// tests/e2e/search.spec.ts
import { expect, test } from "@playwright/test";
import { COPY } from "../../src/lib/copy";
import { members } from "./fixture";

const someone = members[0];

test("Filters while you type, and says so when nobody matches", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("searchbox");

  await box.fill(someone.metier);
  await expect(page.locator("[data-result]").first()).toContainText(someone.nom);

  await box.fill("zzzqqq");
  await expect(page.getByText(COPY.searchEmpty)).toBeVisible();
  // Scoped to the results region: the needs index carries its own mailto for the
  // empty category, and an unscoped locator matches both and fails strict mode.
  await expect(page.locator("[data-results] a[href^='mailto:']")).toBeVisible();
});

test("Keeps the search field at 16px so iOS does not zoom the page on focus", async ({ page }) => {
  await page.goto("/");
  const size = await page
    .getByRole("searchbox")
    .evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});
