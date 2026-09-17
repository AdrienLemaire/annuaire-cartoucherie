// tests/e2e/carte.spec.ts
import { expect, test } from "@playwright/test";
import { COPY } from "../../src/lib/copy";
import { itinerant, pickupOnly } from "./fixture";

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
