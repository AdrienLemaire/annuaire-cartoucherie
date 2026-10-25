// tests/e2e/landing.spec.ts
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { members } from "./fixture";
import { COPY } from "../../src/lib/copy";
import type { Category } from "../../src/content/schemas";

const categories = (
  JSON.parse(readFileSync("src/content/categories.json", "utf-8")) as { categories: Category[] }
).categories;

test("Shows real faces and never blurs one by enlarging it", async ({ page }) => {
  await page.goto("/");
  const portraits = page.locator("img[alt^='Portrait']");
  await expect(portraits.first()).toBeVisible();

  // Lazy-loaded portraits below the fold have naturalWidth 0 until the browser
  // actually fetches them — scroll each into view and wait for it to load
  // before measuring, or the ratio comes back Infinity for the wrong reason.
  const count = await portraits.count();
  for (let i = 0; i < count; i++) {
    const portrait = portraits.nth(i);
    await portrait.scrollIntoViewIfNeeded();
    await portrait.evaluate(
      (img) =>
        new Promise<void>((resolve) => {
          const el = img as HTMLImageElement;
          if (el.complete && el.naturalWidth > 0) return resolve();
          el.addEventListener("load", () => resolve(), { once: true });
        }),
    );
  }

  const factors = await portraits.evaluateAll((images) =>
    images.map((i) => {
      const img = i as HTMLImageElement;
      return img.getBoundingClientRect().width / img.naturalWidth;
    }),
  );
  expect(factors.length).toBeGreaterThanOrEqual(6);
  for (const factor of factors) expect(factor).toBeLessThanOrEqual(1.4);
});

// Under 30 profiles, a greyed row per empty category made the directory look deserted.
test("Gathers the empty categories into one line while the directory is small", async ({
  page,
}) => {
  const used = new Set(members.flatMap((m) => m.categories));
  const empty = categories.filter((c) => !used.has(c.slug));
  expect(members.length).toBeLessThan(30);
  expect(empty.length).toBeGreaterThan(0);

  await page.goto("/");
  const index = page.locator("[data-browse]");
  await expect(index.getByRole("listitem")).toHaveCount(categories.length - empty.length);
  await expect(index.getByText(COPY.needsEmptyGroup(empty.map((c) => c.nom)))).toBeVisible();
});
