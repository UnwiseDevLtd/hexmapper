# hexmapper

A small, dependency-free browser tool for **tracing an image into a hex-grid map**. Upload a map picture as a semi-transparent background, then drag over hexes to paint terrain, rivers, mountains, forests, and towns. Everything runs client-side; nothing is uploaded.

Built as a single self-contained `index.html`. No build step, no framework, no server required — open the file directly, or serve it.

## Features

- **100 × 100** pointy-top hex grid (easy to change at the top of the script).
- **Image background** with opacity / scale / nudge controls so you can align it under the grid, then trace.
- **Terrain palette** with a distinct colour + vector symbol per hex:
  - Desert (light yellow, dunes)
  - Hills / farmland (light green, peaks)
  - Forest (dense green, tree)
  - Marsh (light brown, reeds)
  - Mountains (dark, snow peak)
  - River (blue, wave)
  - Fog / unknown (hatched — for shaded-out regions like the NW corner)
  - Town (settlement icon, painted as an overlay)
  - Eraser
- **Zoom & pan** — wheel-zoom to cursor, right/middle-drag or hold `Space` to pan.
- **Drag-paint** with line-fill so fast strokes don't leave gaps.
- **Autosave** to `localStorage` — refreshes won't lose your work.
- **Export** the hex map as a PNG (background excluded, so the result is a clean map), and **save/load** the terrain data as JSON.

## Quick start

```sh
make serve
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Controls

| Action | How |
|--------|-----|
| Paint    | Left-drag |
| Pan      | Right-drag, middle-drag, or hold `Space` + drag |
| Zoom     | Mouse wheel (zooms toward cursor) |
| Tools    | Number keys `1`–`9` (`0` = erase) |

## Status

Bootstrapping. Single-file; no test suite yet.

## License

GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later). You may use, modify, and redistribute this program under the terms of the AGPL, including the network-use provision. See [LICENSE](LICENSE) for the full text.
