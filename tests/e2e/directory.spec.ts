// tests/e2e/directory.spec.ts
import { expect, test } from "@playwright/test";
import { members } from "./fixture";

// The category nobody has joined yet. Derived, never hardcoded.
const emptySlug = (() => {
  const used = new Set(members.flatMap((m) => m.categories));
  const all = [
    "sante-bien-etre",
    "beaute-soins",
    "artisanat-travaux",
    "alimentation-traiteur",
    "conseil-entreprise",
    "numerique-creation",
    "enfance-education",
    "sport-mouvement",
    "art-culture",
    "services-domicile",
  ];
  const empty = all.find((slug) => !used.has(slug));
  if (!empty) throw new Error("fixture: every category has a member; this test needs an empty one");
  return empty;
})();

const busiest = (() => {
  const counts = new Map<string, number>();
  for (const m of members) for (const c of m.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
})();

test("An empty category explains itself instead of being a dead page", async ({ page }) => {
  await page.goto(`/categorie/${emptySlug}`);
  await expect(page.getByText(/personne encore inscrit/)).toBeVisible();
  await expect(page.locator("a[href^='mailto:']")).toBeVisible();
});

test("Filtering by category narrows the directory in place, without a reload", async ({ page }) => {
  const [slug, count] = busiest;
  await page.goto("/annuaire");
  await expect(page.locator("[data-member]")).toHaveCount(members.length);

  await page.locator(`[data-filter='${slug}']`).click();
  await expect(page.locator("[data-member]:visible")).toHaveCount(count);
  await expect(page).toHaveURL(new RegExp(`cat=${slug}`));
});
