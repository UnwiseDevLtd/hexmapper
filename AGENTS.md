# AGENTS.md — hexmapper

A single-file, dependency-free browser tool for **tracing an image into a hex-grid map**. Vanilla JS + Canvas. No build step, no server, no framework. Treat this as a living system you keep correct.

## What this is

Upload a map image as a translucent background, align it under a 100×100 pointy-top hex grid, then drag over hexes to paint terrain / rivers / mountains / forests / towns. Pure client-side: nothing leaves the browser. Progress autosaves to `localStorage`; export to PNG or JSON.

## Commands

| Action | Command |
|--------|---------|
| Serve locally | `make serve` (then open http://localhost:8000) |
| Open directly | just open `index.html` in a browser |

There is no build, lint, typecheck, or test step yet. Verification is manual: open the page and exercise the tools.

## Architecture

- **One file.** All markup, CSS, and JS live in `index.html`. Don't split prematurely — split only when a third independent concern forces it (workspace "generalize on the third recurrence" rule).
- **Canvas, not SVG/DOM.** 10 000 hexes need cheap redraws. A world-sized offscreen canvas holds the full map (background + hexes + towns); the visible canvas just blits it under the camera transform and draws a crisp hover preview. Terrain changes mark the world canvas dirty and rebuild it; pan/zoom/hover never rebuild.
- **Hex math.** Pointy-top, odd-r offset. `center()` draws; `worldToHex()` (pixel → fractional axial → cube-round → odd-r offset) hit-tests. Keep these consistent — a coordinate-system mismatch is the most likely regression.
- **Data model.** Two flat arrays sized `ROWS*COLS`: `terrain` (Uint8, `0` = empty) and `towns` (Uint8 overlay). Hexes are addressed `row*COLS + col`.
- **Standalone & self-originated.** This repo references no siblings. Keep it that way.

## Source control

Every change on a **branch** off `main`, merged by ff-merge. Never commit directly to `main`. The only exception — the first bootstrap commit — already landed on `main`.

## License

**AGPL-3.0-or-later.** Full text in [LICENSE](LICENSE). New files should carry the SPDX header (`SPDX-License-Identifier: AGPL-3.0-or-later`).

## Opinions

- **No dependencies.** The strength of this tool is that it's one file you can open anywhere. Adding a framework or a bundler has to clear a high bar.
- **Everything client-side.** No network calls. The image you trace and the map you paint never leave the browser.
- **Grid extent is sacred.** `COLS`/`ROWS`/`S` are the only tuning knobs at the top of the script; everything (layout, hit-testing, world-canvas size) derives from them.
- **Symbols are vectors, not glyphs.** Drawn in world units so they scale with zoom and don't depend on font/emoji availability.
- **Prompt → action.** Manual correction of generated output is discouraged — prompt the fix.
