// tests/e2e/privacy.spec.ts
import { expect, test } from "@playwright/test";

// The privacy page promises this in writing, and the absence of a consent
// banner depends on it. Task 16 repeats the assertion against production,
// where the analytics beacon actually loads.
test("Sets no cookie", async ({ page, context }) => {
  await page.goto("/", { waitUntil: "load" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await context.cookies()).toHaveLength(0);
});
