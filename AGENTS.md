# AGENTS.md — hexmapper

A single-file, dependency-free browser tool for **tracing an image into a hex-grid map**. Vanilla JS + Canvas. No build step, no framework. Served via Docker or Podman (nginx) — `make up` auto-detects the engine. Treat this as a living system you keep correct.

## What this is

Upload a map image as a translucent background, align it under a 100×100 pointy-top hex grid, then drag over hexes to paint terrain (with scales), water/lava, rivers, settlements, and entities. Pure client-side; progress autosaves to `localStorage`; export to PNG or JSON.

## Commands

| Action | Command |
|--------|---------|
| Run in Docker/Podman | `make up` (http://localhost:8000) |
| Stop | `make down` |
| Logs | `make logs` |
| Run without Docker | `make serve` (python) or open `index.html` |

No build, lint, typecheck, or test step. Verify by opening the page and exercising the tools.

## Architecture

- **One file.** All markup, CSS, and JS live in `index.html`. Don't split prematurely — split only when a third independent concern forces it.
- **Canvas, not DOM.** ~10 000 hexes need cheap redraws. A world-sized offscreen canvas holds the full map; the visible canvas blits it under the camera transform and draws a crisp hover preview. Edits mark the world canvas dirty and rebuild it; pan/zoom/hover never rebuild.
- **Hex math.** Pointy-top, odd-r offset. `center()` draws; `worldToHex()` (pixel → fractional axial → cube-round → odd-r) hit-tests; `neighbors()` returns the six neighbours in the canonical direction order `E, NE, NW, W, SW, SE`. Keep these consistent — a coordinate/direction mismatch is the most likely regression.
- **Data model.** Three flat arrays sized `ROWS*COLS`, addressed `row*COLS + col`:
  - `terrain` (Uint8): `0` empty, else a terrain id (scales are distinct ids, e.g. Trees=1 / Forest=2).
  - `rivers` (Uint8): boolean overlay.
  - `entity` (Uint8): `0` none, `1` village, `2` city, `3` PoI(`?`), `4` skull, `5` cave.
- **Merging tiles.** Water (`9,10`) and lava (`11,12`) merge across shared edges: `outlineHex()` strokes only the edges whose neighbour has a *different* merge key (so same-id neighbours blend; shallow↔deep keeps a contour). Cities merge the same way via the `cKey` overlay pass.
- **Rivers as edges.** For each river hex, draw centre→midpoint for every shared river edge. This makes a single-neighbour river terminate at the centre, and ≥2-neighbour rivers connect through the centre — by construction.
- **Standalone & self-originated.** This repo references no siblings. Keep it that way.

## Source control

Every change on a **branch** off `main`, merged by ff-merge. Never commit directly to `main`. The only exception — the first bootstrap commit — already landed on `main`.

## License

**AGPL-3.0-or-later.** Full text in [LICENSE](LICENSE). New files should carry the SPDX header (`SPDX-License-Identifier: AGPL-3.0-or-later`).

## Opinions

- **No dependencies.** The strength of this tool is that it's one file you can open anywhere. Adding a framework or a bundler has to clear a high bar.
- **Everything client-side.** No network calls. The image you trace and the map you paint never leave the browser.
- **Grid extent is sacred.** `COLS`/`ROWS`/`S` are the only tuning knobs; everything derives from them.
- **Symbols are vectors, not glyphs** (except the `?`, which uses text). Drawn in world units so they scale with zoom.
- **Prompt → action.** Manual correction of generated output is discouraged — prompt the fix.
