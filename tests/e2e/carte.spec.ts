// tests/e2e/carte.spec.ts
import { expect, test } from "@playwright/test";
import { COPY } from "../../src/lib/copy";
import { isPinned } from "../../src/lib/plan";
import { itinerant, members, pickupOnly } from "./fixture";

type GeoWindow = Record<string, boolean>;

test("Never asks for a position before an explicit tap", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as GeoWindow).geoAsked = false;
    const real = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
    navigator.geolocation.getCurrentPosition = (...args: Parameters<typeof real>) => {
      (window as unknown as GeoWindow).geoAsked = true;
      return real(...args);
    };
  });
  await page.goto("/carte");

  // The ranked list being on screen is the proof the page has finished its work:
  // the promise « classé depuis la Halle » is kept before anyone is asked anything.
  await expect(page.getByText(COPY.mapFromHall)).toBeVisible();
  await expect(page.getByRole("button", { name: /ma position/i })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as GeoWindow).geoAsked)).toBe(false);
});

test("States each of the three address cases instead of flattening them", async ({ page }) => {
  await page.goto("/carte");
  await expect(page.getByText(COPY.mapTheyComeToYou)).toBeVisible();
  await expect(page.getByText(itinerant.nom)).toBeVisible();
  await expect(page.getByText(COPY.mapPickupOnly)).toBeVisible();
  await expect(page.getByText(pickupOnly.nom)).toBeVisible();
  await expect(page.getByText(COPY.mapSchematic)).toBeVisible();
});

// task-15-brief.md: replacing the map's one-CSS-rule-per-pinned-member design
// (unshippable at 200 members, task-14-report.md) must not lose the
// behaviour it had — the pin and its sheet row still highlight each other,
// whichever one is tapped, and the highlight moves rather than just turning
// on once. A deep link (`#pin-<slug>`, as the twelve profile pages send)
// is the same mechanism as a tap, so it doubles as that regression check.
test("A pin and its sheet row highlight each other, and the highlight moves", async ({ page }) => {
  const [first, second] = members.filter(isPinned);

  await page.goto(`/carte#pin-${first.slug}`);
  await expect(page.locator(`.epingle-lien[data-m="${first.slug}"]`)).toHaveCSS("opacity", "1");
  await expect(page.locator(`[data-sheet] [data-m="${first.slug}"]`)).toHaveAttribute("data-selected", "");

  await page.locator(`[data-sheet] [data-m="${second.slug}"] a[href="#pin-${second.slug}"]`).click();

  await expect(page.locator(`.epingle-lien[data-m="${second.slug}"]`)).toHaveCSS("opacity", "1");
  await expect(page.locator(`[data-sheet] [data-m="${second.slug}"]`)).toHaveAttribute("data-selected", "");
  await expect(page.locator(`[data-sheet] [data-m="${first.slug}"]`)).not.toHaveAttribute("data-selected", "");
});
