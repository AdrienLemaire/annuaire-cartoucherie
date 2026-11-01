# v2 mockup scripts

The generators and checks behind the v2 mockups, kept to redo or extend them. They are throwaway
tooling, not part of the site: ESLint ignores `docs/mockups/`. Run everything from the
repository root.

## Generators

Two pages are generated; editing their HTML by hand puts them out of sync with these scripts.
Both reproduce the committed pages byte for byte.

| Page                 | Command                                               |
| -------------------- | ----------------------------------------------------- |
| `v2/formulaire.html` | `python3 docs/mockups/v2/scripts/formulaire/build.py` |
| `v2/carte.html`      | `python3 docs/mockups/v2/scripts/carte.py`            |

They copy blocks from `final/styleguide.html`, `final/membre.html`, `v2/membre.html` and
`_shared/members.json`, so a styleguide change flows in on the next run.

`styleguide-diapos.py <head.html> <out.html>` builds the slide specimens of the styleguide's
`b-v2-diapos` block from its hand-written head.

`membre.html`, `espace.html`, `admin.html` and `styleguide.html` are edited by hand.

## Checks

Headless Chrome through Playwright. Set `CHROME=$(command -v google-chrome-stable)` first on
NixOS.

| Script                                    | Checks                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `check/styleguide-zoom.cjs [ids…]`        | each specimen in a 360 px frame at 100 % and 200 %: overflow, split words |
| `check/styleguide-strict.cjs`             | every text node of every block                                            |
| `check/styleguide-stress.cjs`             | slides at their hard character limits                                     |
| `check/styleguide-orange.cjs`             | orange objects per 740 px screen on a stacked profile                     |
| `check/formulaire.cjs`                    | every form frame: overflow, split words, inputs ≥ 16 px, orange count     |
| `check/formulaire-shot.cjs`               | screenshots of the form frames into `check/shots/`                        |
| `check/carte.mjs`                         | map frames at 360 and 1400 px, 100 % and 200 %                            |
| `check/membre.mjs [width] [dir]`          | profile frames; screenshots into `dir` if given                           |
| `check/membre-orange.mjs`                 | orange objects per screen on the profile frames                           |
| `check/espace-admin.mjs <page> [widths…]` | `<page>` is `espace` or `admin`; includes the admin iframes               |

A word split at its hyphen (« Menuisier-ébéniste ») is allowed; any other split is a bug.
