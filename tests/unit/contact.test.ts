import { describe, it, expect } from "vitest";
import { breakableParts } from "../../src/lib/contact";

describe("breakableParts", () => {
  it.each([
    ["camille.roussel@example.fr", ["camille", ".roussel", "@example", ".fr"]],
    ["@camille_sophro_ctch", ["@camille_", "sophro_", "ctch"]],
  ])("Lets « %s » wrap only at its separators", (text, parts) => {
    expect(breakableParts(text)).toEqual(parts);
  });
});
