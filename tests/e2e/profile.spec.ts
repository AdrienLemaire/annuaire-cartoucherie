// tests/e2e/profile.spec.ts
import { expect, test } from "@playwright/test";
import { feminine, fullyContactable, masculineWithoutSite } from "./fixture";
import { agree } from "../../src/lib/gender";

test("Carries the contact details in full, readable text", async ({ page }) => {
  const m = fullyContactable;
  await page.goto(`/membre/${m.slug}`);
  await expect(page.getByText(m.email!, { exact: false })).toBeVisible();
  await expect(page.getByText(m.site!, { exact: false })).toBeVisible();
  await expect(page.getByText(`@${m.instagram!}`, { exact: false })).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').last()).toBeVisible();
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
