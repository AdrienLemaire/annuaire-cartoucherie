// tests/e2e/journey.spec.ts
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import type { Category } from "../../src/content/schemas";
import { members } from "./fixture";

const { categories } = JSON.parse(readFileSync("src/content/categories.json", "utf-8")) as {
  categories: Category[];
};

// The category with the most neighbours: the journey must work on a full one.
const busiest = categories
  .map((c) => ({ c, count: members.filter((m) => m.categories.includes(c.slug)).length }))
  .sort((a, b) => b.count - a.count)[0].c;

test("Scan a flyer, recognise a need, reach a phone number", async ({ page }) => {
  // The QR on the flyer resolves to the root: it is the only printed entry point.
  await page.goto("/");

  // She does not know the word « sophrologue ». She recognises a need.
  await page.getByText(busiest.besoin).click();
  await expect(page).toHaveURL(new RegExp(`/categorie/${busiest.slug}`));

  // She picks someone.
  await page.locator("[data-member] a").first().click();
  await expect(page).toHaveURL(/\/membre\//);

  // And she has a number, in the thumb zone, big enough to hit.
  const call = page.locator('a[href^="tel:"]').last();
  await expect(call).toBeVisible();
  await expect(call).toHaveAttribute("href", /^tel:\+33\d{9}$/);

  const box = await call.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.y).toBeGreaterThan(viewport.height * 0.6);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("The same journey in three gestures, through the search field", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill(members[0].metier);
  await page.locator("[data-result]").first().click();
  await expect(page.locator('a[href^="tel:"]').last()).toBeVisible();
});
