# Dot Grid

Interactive dot grid with proximity-based glow, displacement, and connection lines between nearby active dots.

## Technique

- Uniform grid of dots with smooth spring-like return to origin
- Cursor proximity triggers: size growth, alpha brightening, color shift toward glow color
- Connection lines drawn between close dots near cursor using spatial grid optimization
- Spatial hash grid (cell size = connect distance) prevents O(n^2) distance checks
- Ambient sine wave gives subtle movement even without cursor

## Parameters

| Param | Default | Description |
|-|-|-|
| `--dg-dot-color` | `#ffffff` | Base dot color |
| `--dg-glow-color` | `#6366f1` | Active dot / line glow color |
| `--dg-dot-size` | `1.5` | Base dot radius |
| `--dg-spacing` | `30` | Grid spacing in pixels |
| `--dg-mouse-radius` | `200` | Mouse influence radius |
| `--dg-connect-distance` | `80` | Max distance for connection lines |

## Usage

```html
<script src="script.js"></script>
```
