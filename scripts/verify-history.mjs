#!/usr/bin/env node
// scripts/verify-history.mjs
// Task 14's own check that it worked: no member content has ever reached this
// public repository's history outside the fictional fixture. A plain
// `git log --all --name-only | grep members.json|portraits/` also matches two
// paths that are not member content and would make the check always "pass"
// by always finding something — which is worse than no check, because it
// looks green without meaning anything (task-14-report.md, fix round 1).
import { execFileSync } from "node:child_process";

const PATTERN = /members\.json|portraits\//;

// The only two prefixes allowed to match, and why each is safe to exclude —
// so a year from now this reads as a decision, not a convenience. Anything
// else that matches is a real finding: this list must never grow to make a
// failing run pass.
const ALLOWED = [
  {
    prefix: "tests/fixtures/",
    why: "the permanent, fictional fixture (task-14-brief.md) — this is what's supposed to be here",
  },
  {
    prefix: "docs/mockups/",
    why:
      "design history that predates the private-content mechanism (Task 14): " +
      "docs/mockups/_shared/members.json is explicitly labelled fictional in its own " +
      "_note field, and docs/mockups/variant-b-portraits/ is a rejected design variant " +
      'whose directory name merely contains the substring "portraits/" — neither ever ' +
      "held real member data",
  },
];

function historyPaths() {
  const raw = execFileSync("git", ["log", "--all", "--name-only", "--pretty=format:"], {
    encoding: "utf-8",
  });
  return [...new Set(raw.split("\n").filter(Boolean))].sort();
}

const matches = historyPaths().filter((path) => PATTERN.test(path));
const unexplained = matches.filter((path) => !ALLOWED.some((rule) => path.startsWith(rule.prefix)));

if (unexplained.length > 0) {
  console.error("verify-history: member data outside the fixture has reached git history:");
  for (const path of unexplained) console.error(`  ${path}`);
  console.error(
    "\nThis cannot be fixed by a later commit — history keeps every clone and fork. " +
      "Stop and tell Adrien; the fix is a history rewrite plus rotated contact details.",
  );
  process.exit(1);
}

console.log(`verify-history: ${matches.length} historical match(es), all explained:`);
for (const rule of ALLOWED) {
  const count = matches.filter((path) => path.startsWith(rule.prefix)).length;
  console.log(`  ${count} under ${rule.prefix} — ${rule.why}`);
}
