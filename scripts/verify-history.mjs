#!/usr/bin/env node
// scripts/verify-history.mjs
// Task 14's own check that it worked: no member content has ever reached this
// public repository's history outside the fictional fixture. A plain
// `git log --all --name-only | grep members.json|portraits/` also matches two
// paths that are not member content and would make the check always "pass"
// by always finding something — which is worse than no check, because it
// looks green without meaning anything (task-14-report.md, fix round 1).
import { execFileSync } from "node:child_process";

const PATTERN = /members\.json|portraits\/|carrousels\//;

// tests/fixtures/ is a prefix, deliberately: it is the single, designated
// container for the fictional fixture (CLAUDE.md, task-14-brief.md), governed
// end to end by its own rules (the ARCEP phone range, the example.fr emails).
// A new member added to it is still fictional by construction.
//
// docs/mockups/, by contrast, is where this project routinely drops new
// design work — four variant directories already exist, plus brand/, design/
// and _shots/ — so a prefix there would keep matching every future addition
// without anyone having to widen it (task-14-report.md, fix round 2). Each
// entry below is therefore the exact path already in history, not a prefix:
// a new file under docs/mockups/ — including a future variant built against
// real content to test 200 real neighbours — is NOT pre-approved and must
// surface as unexplained.
const ALLOWED_PREFIXES = [
  {
    prefix: "tests/fixtures/",
    why: "the permanent, fictional fixture (task-14-brief.md) — this is what's supposed to be here",
  },
];

const ALLOWED_EXACT = [
  {
    path: "docs/mockups/_shared/members.json",
    why: "explicitly labelled fictional in its own _note field",
  },
  ...["README.md", "annuaire.html", "carte.html", "index.html", "membre.html"].map((name) => ({
    path: `docs/mockups/variant-b-portraits/${name}`,
    why:
      "a rejected design variant; matches only because its directory name contains the " +
      'substring "portraits/" — it holds no portrait file',
  })),
];

function isAllowed(path) {
  return (
    ALLOWED_PREFIXES.some((rule) => path.startsWith(rule.prefix)) ||
    ALLOWED_EXACT.some((rule) => rule.path === path)
  );
}

function historyPaths() {
  const raw = execFileSync("git", ["log", "--all", "--name-only", "--pretty=format:"], {
    encoding: "utf-8",
  });
  return [...new Set(raw.split("\n").filter(Boolean))].sort();
}

const matches = historyPaths().filter((path) => PATTERN.test(path));
const unexplained = matches.filter((path) => !isAllowed(path));

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
for (const rule of ALLOWED_PREFIXES) {
  const count = matches.filter((path) => path.startsWith(rule.prefix)).length;
  console.log(`  ${count} under ${rule.prefix} — ${rule.why}`);
}
for (const rule of ALLOWED_EXACT) {
  if (matches.includes(rule.path)) console.log(`  ${rule.path} — ${rule.why}`);
}
