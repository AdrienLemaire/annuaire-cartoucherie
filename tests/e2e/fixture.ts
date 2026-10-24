// tests/e2e/fixture.ts
// Property-based selectors over the fictional fixture. No spec hardcodes a slug:
// the fixture is data, and data changes.
import { readFileSync } from "node:fs";
import type { Member } from "../../src/content/schemas";
import { hasAddress } from "../../src/lib/members";

const raw = readFileSync("tests/fixtures/members.json", "utf-8");
export const members: Member[] = (JSON.parse(raw) as { membres: Member[] }).membres;

function pick(predicate: (m: Member) => boolean, what: string): Member {
  const found = members.find(predicate);
  if (!found) throw new Error(`fixture: no member ${what}`);
  return found;
}

/** Full contact card: phone, email, site and Instagram all present. */
export const fullyContactable = pick(
  (m) => Boolean(m.tel && m.email && m.site && m.instagram),
  "with every contact field",
);

/** Her profile must read « Ce qu'elle propose » and « Où la trouver ». */
export const feminine = pick((m) => m.genre === "f" && Boolean(m.tel), "feminine with a phone");

/** His profile must read « Ce qu'il propose » and must render no site row. */
export const masculineWithoutSite = pick(
  (m) => m.genre === "h" && m.site === null,
  "masculine without a website",
);

/** No address to go to: the disc portrait, and « Ils viennent chez vous ». */
export const itinerant = pick((m) => m.distance === "—", "without an address");

/** A real address and distance, but no public pin: the map's pickup-address row. */
export const pickupOnly = pick((m) => hasAddress(m) && !m.surCarte, "with an address but no map pin");

/** Nobody has reviewed yet: no « 0,0 » score anywhere. */
export const unreviewed = pick((m) => m.nbAvis === 0, "with no review yet");

// Every export here is used by a spec. An unused one is a selector nobody needs:
// delete it rather than keeping it « for later ».
