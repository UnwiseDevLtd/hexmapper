# AGENTS.md — hexmapper

A dependency-free browser tool for **tracing an image into a hex-grid map**. Plain JS + Canvas, no framework. Source lives in `src/` and is concatenated by `build.js` into `dist/app.js` (no bundler, no modules). Served via Docker or Podman (nginx, multi-stage build). Treat this as a living system you keep correct.

## What this is

Upload a map image as a translucent background, align it under a pointy-top hex grid, then drag to paint. Paint layers: **terrain** (tiles, some with two levels), **vegetation** (trees/forest overlay on top of terrain), **rivers** (water/lava) and **roads** (edge-midpoint overlays, additive), **points of interest** (town, city, cave, danger, unknown), and free-position **text labels**. Plus fill mode, 60° rotation, configurable grid size, alpha-num hex IDs. Pure client-side; autosaves to `localStorage`; export to PNG/JSON.

## Commands

| Action | Command |
|--------|---------|
| Run in Docker/Podman | `make up` (http://localhost:8000) |
| Stop | `make down` |
| Logs | `make logs` |
| Compile bundle | `npm run build` / `make build` |
| Watch & rebuild | `npm run watch` / `make watch` |
| Run without Docker | `make serve` (builds, then python :8000) |

No lint/typecheck/test step. Verify by opening the page and exercising the tools.

## Architecture

- **Source split, build-concatenated.** `src/*.js` are plain global scripts (no `import`/`export`); `build.js` concatenates them in filename sort order into a single `dist/app.js` that `index.html` loads. Files are numbered (`00-…` to `99-init.js`) so order is stable. All top-level declarations share one scope — never redeclare a name across files. `dist/` is a gitignored artifact; edit `src/`, never `dist/`.
- **Canvas, not DOM.** A world-sized offscreen canvas holds the full map; the visible canvas blits it under the camera transform and draws a crisp hover preview. Edits mark the world canvas dirty and rebuild it; pan/zoom/hover never rebuild.
- **Hex math.** Pointy-top, odd-r offset. `center()` draws; `worldToHex()` (pixel → fractional axial → cube-round → odd-r) hit-tests; `neighbors()` returns the six neighbours in canonical order `E, NE, NW, W, SW, SE`. `rotateHex60()` goes via cube coords. Keep these consistent — a coordinate/direction mismatch is the most likely regression.
- **Data model.** Flat arrays sized `ROWS*COLS`, addressed `row*COLS + col`, plus a text list:
  - `terrain` (Uint8): `0` empty, else a terrain id. Ids start at 3 (1,2 were retired when trees/forest became vegetation).
  - `rivers` (Uint8): `0` none, `1` water, `2` lava.
  - `roads` (Uint8): `0`/`1`.
  - `veg` (Uint8): `0` none, `1` trees, `2` forest.
  - `entity` (Uint8): `0` none, `1` town, `2` city, `3` unknown, `4` danger, `5` cave.
  - `texts`: `{x,y,s,size}` in world coords.
- **Overlays are additive.** Rivers, roads, and vegetation always *set* on left-click (never toggle); **right-click erases**. Erase clears every layer on the hex.
- **Merging tiles.** Water (`9,10`) and lava (`11,12`) merge across shared edges (`outlineHex()` strokes only edges whose neighbour has a *different* merge key; shallow↔deep keeps a contour). Cities merge the same way via the `cKey` pass.
- **Rivers/roads as edges.** `drawOverlay()` draws centre→midpoint for every shared edge whose neighbour carries the same value — so a single-neighbour run terminates at the centre, by construction.
- **Input model.** Left paints the active tool (or flood-fills in Fill mode); **right always erases**; middle pans; wheel zooms. Right-erase takes precedence. The only keyboard shortcuts are `Ctrl+Z` / `Ctrl+Shift+Z`.
- **History.** `commit(kind)` pushes a post-change snapshot (all arrays + dims + texts) onto a capped (100) ring; `restore()` re-allocates arrays to the snapshot's `cols/rows`. Only `kind==="text"` coalesces.
- **Standalone & self-originated.** References no siblings. Keep it that way.

## Source control

Every change on a **branch** off `main`, merged by ff-merge. Never commit directly to `main`. The only exception — the first bootstrap commit — already landed on `main`.

## License

**AGPL-3.0-or-later.** Full text in [LICENSE](LICENSE). New files should carry the SPDX header (`SPDX-License-Identifier: AGPL-3.0-or-later`).

## Opinions

- **No dependencies, no modules.** Plain JS concatenated by a one-file Node script. Adding a bundler/framework must clear a high bar.
- **Everything client-side.** No network calls. The image you trace and the map you paint never leave the browser.
- **Grid extent is sacred.** `COLS`/`ROWS`/`S` derive everything; changing them preserves the overlapping region.
- **Symbols are vectors, not glyphs** (except the `?`, which uses text). Drawn in world units so they scale with zoom.
- **Prompt → action.** Manual correction of generated output is discouraged — prompt the fix.
