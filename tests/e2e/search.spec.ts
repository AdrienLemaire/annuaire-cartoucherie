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

// C2 (final-fixes-report.md): /404 and /categorie/[slug] rendered <SearchBar />
// with neither [data-results] nor the live-search script, so a no-JS GET
// (the input deliberately carries no `name`) navigated to /annuaire with the
// typed query silently dropped — worst on /404, whose own Colly panel says
// "Cherchez ce que vous cherchiez" directly above a box that threw it away.
// A nonexistent slug, not the literal "/404": that is what a real stale QR
// code actually lands on (a11y.spec.ts's own precedent).
test("Works on the 404 page too — the stale-QR-code scenario", async ({ page }) => {
  await page.goto("/ce-slug-n-existe-pas");
  const box = page.getByRole("searchbox");

  await box.fill(someone.metier);

  await expect(page.locator("[data-result]").first()).toContainText(someone.nom);
  expect(page.url()).not.toContain("/annuaire");
});

// A first visit on a weak connection is this project's founding scenario, and no
// service-worker cache exists yet on a first visit — so a failed fetch must say
// something rather than leave the box looking broken while someone types into it
// (task-12 fix round 1, finding 2). This is a decision that could have gone the
// other way (silent, message, or retry-forever), so it earns a test of its own.
test("Tells the visitor when the index fails to load, in French", async ({ page }) => {
  await page.route("**/recherche.json", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("searchbox").fill(someone.metier);
  await expect(page.getByText(COPY.searchLoadError)).toBeVisible();
});
