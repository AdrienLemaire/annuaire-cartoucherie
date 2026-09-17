// tests/e2e/landing.spec.ts
import { expect, test } from "@playwright/test";

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
