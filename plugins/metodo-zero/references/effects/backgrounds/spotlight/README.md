# Spotlight

Cursor-following spotlight with dual glow layers, grid reveal via CSS mask, and smooth interpolated tracking.

## Technique

- Radial gradient follows cursor with rAF-driven smooth interpolation
- CSS `mask-image` on grid layer reveals grid pattern only within spotlight radius (Aceternity-style grid reveal)
- Dual spotlight layers: primary follows cursor, secondary trails with hue-rotate offset
- Ring border provides subtle cursor indicator
- All positioning via CSS custom properties for zero-layout-thrash updates

## Parameters

| Param | Default | Description |
|-|-|-|
| `--spt-color` | `#6366f1` | Spotlight glow color |
| `--spt-radius` | `400` | Spotlight radius in pixels |
| `--spt-grid-visible` | `1` | Grid visibility (0 or 1) |
| `--spt-grid-color` | `rgba(255,255,255,0.04)` | Grid line color |
| `--spt-grid-size` | `60px` | Grid cell size |

## Usage

```html
<script src="script.js"></script>
```
