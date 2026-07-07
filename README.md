# hexmapper

A small, dependency-free browser tool for **tracing an image into a hex-grid map**. Upload a map picture as a semi-transparent background, then drag over hexes to paint **terrain**, **rivers**, **points of interest**, and **text labels**. Everything runs client-side; nothing is uploaded.

Single self-contained `index.html`. No build step, no framework. Served via Docker or Podman (nginx) — `make up` auto-detects which.

## Features

- **100 × 100** pointy-top hex grid (tune `COLS`/`ROWS`/`S` at the top of the script).
- **Image background** with opacity / scale / nudge to align it under the grid before tracing.
- **Terrain** (two levels each, light → heavy): trees→forest, grasslands→hills, plains→desert, small→large mountain, shallow→deep water, shallow→deep lava; plus single-level marsh and fog. Water and lava merge across shared edges into continuous bodies (shallow↔deep keeps a contour line).
- **Rivers** (water *or* lava) are overlays, not tiles. A river hex connects its centre to the midpoint of every edge it shares with another river of the **same type**, so a single-neighbour river terminates at the centre.
- **Points of interest:** Town, City, Danger (skull), Dungeon (cave), Unknown (`?`). Cities merge across shared edges like water; the rest are standalone markers.
- **Text labels:** black text on a white rounded box, adjustable font size. Press **Text**, click the map to drop a *selected* label, then edit/drag/delete it; click an existing label to re-select. The options panel appears only while Text is active.
- **Zoom & pan** — wheel-zoom to cursor, right/middle-drag or hold `Space` to pan.
- **Drag-paint** with line-fill so fast strokes leave no gaps.
- **Autosave** to `localStorage`; **export** a clean PNG (no background) and **save/load** as JSON.
- **Undo/redo** — every paint stroke, erase, text edit/move/delete is a history step (`Ctrl+Z` / `Ctrl+Shift+Z`, or the buttons). Rapid typing coalesces into one step.

## Quick start

```sh
make up          # http://localhost:8000  (Docker or Podman, auto-detected)
make down        # stop
```

Without Docker:

```sh
make serve       # python static server
# or just open index.html in a browser
```

## Controls

| Action | How |
|--------|-----|
| Paint | Left-drag |
| Erase | Right-click or right-drag |
| Pan   | Middle-drag, or hold `Space` + drag |
| Zoom  | Mouse wheel (toward cursor) |
| Undo / Redo | `Ctrl+Z` / `Ctrl+Shift+Z` (or `Ctrl+Y`) |
| Tools | `1`–`9` terrain · `0` erase · `r`/`l` water/lava river · `t` town · `c` city · `d` dungeon · `g` danger · `u` unknown · `x` text |

In Text mode: click to add or select a label (its value is edited in the panel, not placed at the cursor), drag to move, `Del` to delete, `Esc` to deselect.

## Status

Bootstrapping. Single-file; no test suite yet.

## License

GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later), including the network-use provision. See [LICENSE](LICENSE).
