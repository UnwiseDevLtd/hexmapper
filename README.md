# hexmapper

A dependency-free browser tool for **tracing an image into a hex-grid map**. Upload a map picture as a semi-transparent background, then drag over hexes to paint terrain, vegetation, rivers, roads, points of interest, and text labels. Everything runs client-side; nothing is uploaded.

Plain JS source in `src/` is concatenated by a tiny Node script into `dist/app.js` (no bundler, no modules, no framework). Served via Docker or Podman (nginx).

## Features

- **Hex grid** — pointy-top, configurable columns/rows (default 100×100); resize preserves the overlapping region.
- **Image background** with opacity / scale / nudge to align it under the grid before tracing.
- **Terrain** (tiles, some with two levels): grasslands/hills, plains/desert, small/large mountain, shallow/deep water, shallow/deep lava, marsh, fog. Water & lava merge across shared edges into continuous bodies (shallow↔deep keeps a contour). Large mountain renders as a small peak overlaid on a larger back peak.
- **Vegetation overlay** — Trees and Forest are overlays you place *on top of* a terrain tile (trees on grass, forest on hills, etc.). Forest uses a distinct clustered-canopy icon.
- **Rivers & roads** — overlays, not tiles. A river/road hex connects its centre to the midpoint of every edge it shares with another of the **same type**, so a single-neighbour run terminates at the centre. Rivers come in water and lava; roads are dashed. All three are **additive** (left-click adds, right-click removes).
- **Points of interest:** Town, City, Cave, Danger (skull), Unknown (`?`). Cities merge across shared edges like water; the rest are standalone markers. Caves sit on top of terrain (cave on forest, cave on mountain).
- **Fill mode** — flood-fill connected tiles matching the one you click (trace an outline, then fill inside).
- **Rotate 60°** — proper hex rotation via cube coordinates (hex grids rotate in 60° steps, not 90°).
- **Hex IDs** — optional alpha-numeric labels per hex (`BC-23` = row BC, col 23), with background/position/size options.
- **Text labels** — black on white rounded box, adjustable font size. Selection-based: press Text, click to drop a *selected* label, then edit/drag/delete it.
- **Undo/redo** — every stroke, erase, overlay edit, text edit/move/delete is a history step. Rapid typing coalesces.
- **Zoom & pan**, drag-paint with line-fill, autosave to `localStorage`, PNG export (no background), JSON save/load.

## Quick start

```sh
make up          # build in Docker/Podman -> http://localhost:8000
make down        # stop
```

Without Docker (needs Node):

```sh
npm run build    # or: make build   -> compiles src/ into dist/app.js
make serve       # python static server on :8000
```

## Developing

Edit files under `src/` (numbered so concatenation order is stable), then:

```sh
npm run watch    # rebuild dist/app.js on every src/ change
```

`index.html` loads `dist/app.js`, which is a gitignored build artifact — don't edit it by hand.

## Controls

| Action | How |
|--------|-----|
| Paint | Left-drag (or Fill mode + click) |
| Erase | Right-click or right-drag |
| Pan   | Middle-drag |
| Zoom  | Mouse wheel (toward cursor) |
| Undo / Redo | `Ctrl+Z` / `Ctrl+Shift+Z` |

Tool selection is via the palette (no keyboard shortcuts). In Text mode: click to add/select a label, drag to move, Delete via the panel button.

## Status

Bootstrapping. No test suite yet.

## License

GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later), including the network-use provision. See [LICENSE](LICENSE).
