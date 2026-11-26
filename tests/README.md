# Tests

Development tooling for Hope Starts Small. The game itself has no
dependencies — everything on this page is only for checking it.

## smoke.js — the smoke suite

A Playwright-driven pass over the whole Seeds slice: title, intro, the
daily watering loop, growth stages, the first trial, the Plant Register,
saving/continuing, migration of old save formats, plus regression checks
for the movement seam rendering, Alvin's auto-displace, the talking
frames, Alvin's idle sit, the weeds → compost → good dirt loop, and the
title-screen theme song (playback, the MUSIC setting, and the melody's
match to the hymnal reference and to `theme.mid`).

## make-theme.js — the theme song source

`theme.mid` (repo root) and the THEME data inside `game.js` are both
generated from the single arrangement defined in `tests/make-theme.js`:

```
node tests/make-theme.js
```

It verifies the melody against its public-domain sources (see the
header comment), rewrites `theme.mid`, and prints the literal to paste
into `game.js`.

Run it from anywhere:

```
node tests/smoke.js
```

It serves the repo root itself on <http://127.0.0.1:8907> (if a server
already holds that port, it uses that one instead). Results land in
`tests/smoke.log`; screenshots in `tests/shots/`.

## charshot.js — the character screenshot rig

Dumps pixel-exact sprite sheets from the live sprite canvases plus
in-context shots (facings, trial, register) for art review:

```
node tests/charshot.js <output-dir>
```

## Dependencies

Both scripts need **playwright-core** and a Chromium build. They first
try a plain `require('playwright-core')` (a local `npm install
playwright-core` anywhere Node resolves it from), and fall back to the
install that lives with the Survival Game's test rig on the development
machine:

```
/home/hatch/workspace/survival-game/tests/node_modules/playwright-core
```

Chromium is located under `~/.cache/ms-playwright` (the usual
Playwright browser cache). On a fresh machine: `npm install
playwright-core` and `npx playwright-core install chromium` (or point
the fallback path above at your own install).
