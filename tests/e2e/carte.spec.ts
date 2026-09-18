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

// C1 (final-fixes-report.md): [data-geo-status] carried the Tailwind class
// `hidden` while src/client/geolocate.ts's showStatus() only ever
// removeAttribute("hidden") — an attribute never set. The paragraph stayed
// display:none forever, so neither the grant reassurance nor the ONLY
// feedback on a denial ever appeared. Both branches, with a real (mocked)
// browser geolocation API rather than the machine's own location.
test("Shows the reassurance message once a position is granted, and reorders the sheet", async ({
  page,
  context,
}) => {
  const [target] = members.filter(isPinned);
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: target.lat!, longitude: target.lng! });
  await page.goto("/carte");

  await page.getByRole("button", { name: /ma position/i }).click();

  await expect(page.getByText(COPY.mapGeoGranted)).toBeVisible();
  // The strongest, most concrete proof the reorder actually ran: the member
  // whose coordinates match the granted position is now 0 m away, and first.
  await expect(page.locator(`[data-sheet] [data-m="${target.slug}"] .dist`)).toHaveText("0 m");
  await expect(page.locator("[data-sheet] > li").first()).toHaveAttribute("data-slug", target.slug);
});

test("Shows the denied message when geolocation is refused, and leaves the sheet alone", async ({ page }) => {
  // No context.grantPermissions(): Chromium then rejects getCurrentPosition
  // outright (PERMISSION_DENIED), with no dialog to interact with — the same
  // outcome a visitor who has blocked location for their browser would see.
  await page.goto("/carte");
  const firstRow = await page.locator("[data-sheet] > li").first().getAttribute("data-slug");

  await page.getByRole("button", { name: /ma position/i }).click();

  await expect(page.getByText(COPY.mapGeoDenied)).toBeVisible();
  await expect(page.locator("[data-sheet] > li").first()).toHaveAttribute("data-slug", firstRow!);
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
// A row's own [data-selected] attribute is carte-select.ts's internal
// mechanism, not something a visitor sees — asserts on the visible
// consequence instead (final-fixes-report.md, M20): the CSS rule
// `.feuille [data-m][data-selected]` swaps the plain white row background for
// var(--color-teal-50), so an unselected row is exactly rgb(255, 255, 255)
// and a selected one is not.
const WHITE = "rgb(255, 255, 255)";

test("A pin and its sheet row highlight each other, and the highlight moves", async ({ page }) => {
  const [first, second] = members.filter(isPinned);

  await page.goto(`/carte#pin-${first.slug}`);
  await expect(page.locator(`.epingle-lien[data-m="${first.slug}"]`)).toHaveCSS("opacity", "1");
  await expect(page.locator(`[data-sheet] [data-m="${first.slug}"]`)).not.toHaveCSS("background-color", WHITE);

  await page.locator(`[data-sheet] [data-m="${second.slug}"] a[href="#pin-${second.slug}"]`).click();

  await expect(page.locator(`.epingle-lien[data-m="${second.slug}"]`)).toHaveCSS("opacity", "1");
  await expect(page.locator(`[data-sheet] [data-m="${second.slug}"]`)).not.toHaveCSS("background-color", WHITE);
  await expect(page.locator(`[data-sheet] [data-m="${first.slug}"]`)).toHaveCSS("background-color", WHITE);
});
