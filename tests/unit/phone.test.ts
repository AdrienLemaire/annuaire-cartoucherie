import { describe, it, expect } from "vitest";
import { formatTelHref } from "../../src/lib/phone";

describe("Phone formatting", () => {
  // A tel: href must be international or some Android dialers drop it, and the
  // digits are typed by hand into the JSON in the French grouped form. This
  // number is Camille Roussel's, from the fictional fixture range 06 39 98 00 XX
  // (ruling 2 of task-4-brief.md: the format matters, not the digits).
  it("Turns a French number into an international tel: target", () => {
    expect(formatTelHref("06 39 98 00 01")).toBe("+33639980001");
    expect(formatTelHref("0639980001")).toBe("+33639980001");
  });
});
