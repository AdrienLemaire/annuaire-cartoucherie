// tests/e2e/contenu.spec.ts
// The only browser assertions that ever run against real content. Every other
// spec runs on twelve invented people (tests/fixtures/members.json); this one
// discovers what it checks — no hardcoded slug — so it works unchanged against
// the fixture locally and against two hundred real neighbours in the deploy job.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function profileLinks(page: Page): Promise<string[]> {
  await page.goto("/annuaire");
  const hrefs = await page
    .locator('a[href^="/membre/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  const unique = [...new Set(hrefs)];
  expect(unique.length, "the directory lists nobody — CONTENT_DIR is wrong").toBeGreaterThan(0);
  return unique;
}

test("every profile the directory links to is actually built", async ({ page }) => {
  const missing: string[] = [];
  for (const href of await profileLinks(page)) {
    const response = await page.request.get(href);
    if (!response.ok()) missing.push(`${href} → ${response.status()}`);
  }
  expect(missing).toEqual([]);
});

test("the full directory does not overflow sideways at 360 px", async ({ page }) => {
  await page.goto("/annuaire");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "a real name or category label is wider than the phone").toBeLessThanOrEqual(0);
});

test("the directory and a real profile have no serious or critical axe violation", async ({ page }) => {
  // Axe over a real ~200-row /annuaire took 26.8s in a rehearsal against a
  // synthetic 200-member build (task-14-report.md) — too close to Playwright's
  // 30s default on a slower CI runner. The deploy job has an 8-minute budget;
  // spend a little of it here rather than fail closed on timing, not content.
  test.setTimeout(90_000);
  const [firstProfile] = await profileLinks(page);
  for (const path of ["/annuaire", firstProfile]) {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const severe = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(severe.map((v) => `${path}: ${v.id}`)).toEqual([]);
  }
});
