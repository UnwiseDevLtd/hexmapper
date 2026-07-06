# hexmapper

A small, dependency-free browser tool for **tracing an image into a hex-grid map**. Upload a map picture as a semi-transparent background, then drag over hexes to paint terrain, water, rivers, settlements, and entities. Everything runs client-side; nothing is uploaded.

Single self-contained `index.html`. No build step, no framework. Served via Docker (nginx) by default.

## Features

- **100 × 100** pointy-top hex grid (tune `COLS`/`ROWS`/`S` at the top of the script).
- **Image background** with opacity / scale / nudge to align it under the grid before tracing.
- **Terrain with scales** (two levels each, light → heavy):
  - Trees → Forest
  - Grasslands → Hills
  - Plains → Desert
  - Small mountain → Large mountain
  - Shallow water → Deep water
  - Shallow lava → Deep lava
  - plus single-level Marsh and Fog (unknown / shaded-out regions).
- **Merging tiles.** Water and lava merge across shared edges into continuous bodies (shallow and deep keep a depth-contour line between them).
- **Rivers are overlays, not tiles.** A river hex connects its centre to the midpoint of every edge it shares with another river hex — so rivers flow through tiles and **terminate at the centre** when a tile has only one river neighbour.
- **Settlements.** Villages are isolated buildings; **Cities merge** across shared edges like water (connected city tiles form one urban mass).
- **Entities:** `?` point-of-interest, skull, and cave markers.
- **Zoom & pan** — wheel-zoom to cursor, right/middle-drag or hold `Space` to pan.
- **Drag-paint** with line-fill so fast strokes leave no gaps.
- **Autosave** to `localStorage`; **export** a clean PNG (no background) and **save/load** terrain data as JSON.

## Quick start

```sh
make up          # http://localhost:8000  (Docker)
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
| Pan   | Right-drag, middle-drag, or hold `Space` + drag |
| Zoom  | Mouse wheel (toward cursor) |
| Tools | `1`–`9` terrain · `0` erase · `r` river · `v` village · `c` city · `p` ? · `k` skull · `e` cave |

## Status

Bootstrapping. Single-file; no test suite yet.

## License

GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later), including the network-use provision. See [LICENSE](LICENSE).
