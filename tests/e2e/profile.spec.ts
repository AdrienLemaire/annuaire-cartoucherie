// tests/e2e/profile.spec.ts
import { expect, test } from "@playwright/test";
import { feminine, fullyContactable, masculineWithoutSite, unreviewed, withCarousel } from "./fixture";
import { agree } from "../../src/lib/gender";
import { COPY } from "../../src/lib/copy";
import { formatNote } from "../../src/lib/members";
import { formatTelDisplay, formatTelHref } from "../../src/lib/phone";

test("Carries the contact details in full, readable text", async ({ page }) => {
  const m = fullyContactable;
  await page.goto(`/membre/${m.slug}`);
  await expect(page.getByText(m.email!, { exact: false })).toBeVisible();
  await expect(page.getByText(m.site!, { exact: false })).toBeVisible();
  await expect(page.getByText(`@${m.instagram!}`, { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: COPY.profileLinkedin })).toHaveAttribute(
    "href",
    `https://www.linkedin.com/in/${m.linkedin!}/`,
  );
  await expect(page.locator('a[href^="tel:"]').last()).toBeVisible();
});

// Members asked for « Appeler » without their number on display.
test("Keeps the number off the page until asked, and still dials", async ({ page }) => {
  const m = feminine;
  const digits = formatTelDisplay(m.tel!);
  await page.goto(`/membre/${m.slug}`);
  await expect(page.getByText(digits)).toBeHidden();
  const call = page.locator('a[href^="tel:"]').last();
  await expect(call).toHaveAttribute("href", `tel:${formatTelHref(m.tel!)}`);
  await expect(call).not.toContainText(/\d/);

  await page.getByText(COPY.profileShowPhone).click();
  await expect(page.getByText(digits)).toBeVisible();
});

test("Renders nothing at all for a field the member left empty", async ({ page }) => {
  await page.goto(`/membre/${masculineWithoutSite.slug}`);
  await expect(page.getByText("Son site")).toHaveCount(0);
  await expect(page.locator("a[href='null'], a[href='']")).toHaveCount(0);
});

test("Agrees its French with the gender of the neighbour", async ({ page }) => {
  await page.goto(`/membre/${feminine.slug}`);
  await expect(page.getByText(`Ce qu'${agree("f", "elle")} propose`)).toBeVisible();
  await expect(page.getByText(`Où ${agree("f", "la")} trouver`)).toBeVisible();

  await page.goto(`/membre/${masculineWithoutSite.slug}`);
  await expect(page.getByText(`Ce qu'${agree("h", "elle")} propose`)).toBeVisible();
  await expect(page.getByText(`Où ${agree("h", "la")} trouver`)).toBeVisible();
});

// The one place this suite asserts on an attribute rather than on what the
// visitor sees: these four names are a documented interface with Plan 2.
//
// The section heading is targeted by role rather than by getByText: the
// identity card's own rating badge also reads "{n} avis du quartier" (the
// mockup's own wording, membre.html:402), so a plain text match would be
// ambiguous between the two. role=heading is not.
test("Reserves the reviews slot Plan 2 replaces", async ({ page }) => {
  const m = feminine;
  await page.goto(`/membre/${m.slug}`);
  await expect(page.getByRole("heading", { name: "Avis du quartier" })).toBeVisible();
  const slot = page.locator("[data-reviews-slot]");
  await expect(slot).toHaveAttribute("data-slug", m.slug);
  await expect(slot).toHaveAttribute("data-review-count", String(m.nbAvis));
});

// « 0,0 » reads as a bad score; before the first review the page says so in
// words instead.
test("Shows no score before the first review", async ({ page }) => {
  await page.goto(`/membre/${unreviewed.slug}`);
  await expect(page.getByText(COPY.reviewsNone)).toBeVisible();
  await expect(page.getByText(formatNote(0), { exact: true })).toHaveCount(0);
});

// The slides are text set in images: their words are the images' alt text, so a
// screen reader reads them without a visible transcript on the page.
test("Gives each carousel slide its words as alt text", async ({ page }) => {
  await page.goto(`/membre/${withCarousel.slug}`);
  const carousel = page.getByRole("list", { name: COPY.carouselLabel });
  for (const slide of withCarousel.carrousel) {
    await expect(carousel.getByRole("img", { name: slide.texte })).toHaveCount(1);
  }
});

// Instagram's gesture: tapping a slide opens it full screen, on that slide.
test("Opens a tapped slide full screen", async ({ page }) => {
  const second = withCarousel.carrousel[1];
  await page.goto(`/membre/${withCarousel.slug}`);
  const carousel = page.getByRole("list", { name: COPY.carouselLabel });
  await carousel.getByRole("img").first().scrollIntoViewIfNeeded();
  await carousel.evaluate((el) => el.scrollTo({ left: el.clientWidth, behavior: "instant" }));
  await carousel.getByRole("img", { name: second.texte }).click();
  const dialog = page.getByRole("dialog", { name: COPY.carouselLabel });
  await expect(dialog.getByRole("img", { name: second.texte })).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

// The QR code sits beside the name on a large screen; on a phone it waits
// behind a button rather than pushing the contact details down.
test("Shows the QR code behind a button on a phone", async ({ page, isMobile }) => {
  test.skip(!isMobile, "a phone layout");
  await page.goto(`/membre/${feminine.slug}`);
  const qr = page.getByRole("img", { name: COPY.qrAlt(feminine.nom) });
  await expect(qr).toHaveCount(0);
  await page.getByRole("button", { name: COPY.qrShow }).click();
  await expect(qr).toBeVisible();
});

test("Shows no carousel for a neighbour without slides", async ({ page }) => {
  await page.goto(`/membre/${unreviewed.slug}`);
  await expect(page.getByRole("list", { name: COPY.carouselLabel })).toHaveCount(0);
});
