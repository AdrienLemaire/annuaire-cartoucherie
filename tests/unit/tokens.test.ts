import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("Design tokens", () => {
  // Tailwind 4 tree-shakes plain @theme, so every var(--color-teal-950) in the
  // product CSS silently resolves to nothing. No error, no build failure: the
  // page simply renders white on white. This project has hit it twice.
  it("Declares the theme with @theme static, never plain @theme", () => {
    const css = readFileSync("src/styles/global.css", "utf-8");
    expect(css).toContain("@theme static");
    expect(css).not.toMatch(/@theme(?!\s+static)\s*\{/);
  });
});
