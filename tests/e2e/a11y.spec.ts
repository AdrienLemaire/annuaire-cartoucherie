// tests/e2e/a11y.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { feminine, withCarousel } from "./fixture";

// A nonexistent slug, not the literal "/404": a real visitor never types that
// path, they land on one that doesn't exist (a stale printed QR, a mistyped
// share link), and this is what actually exercises the not-found route
// rather than a page that happens to also be reachable directly.
const PAGES = [
  "/",
  "/annuaire",
  `/membre/${feminine.slug}`,
  `/membre/${withCarousel.slug}`,
  "/carte",
  "/categorie/sante-bien-etre",
  "/mentions-legales",
  "/confidentialite",
  "/ce-slug-n-existe-pas",
];

for (const path of PAGES) {
  test(`${path} has no serious or critical axe violation`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const severe = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(severe.map((v) => `${v.id} — ${v.nodes.length} node(s)`)).toEqual([]);
  });

  // The only no-horizontal-overflow assertion in the suite. At 200 % text zoom,
  // because that is the case that actually breaks and the one older residents hit.
  test(`${path} holds at 200 % text zoom without overflowing sideways`, async ({ page }) => {
    await page.goto(path);
    await page.addStyleTag({ content: "html{font-size:200%}" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `horizontal overflow at 200 % on ${path}`).toBeLessThanOrEqual(0);
  });
}
