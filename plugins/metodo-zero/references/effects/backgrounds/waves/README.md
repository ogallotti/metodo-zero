# Waves

Multi-layered wave animation driven by proper Perlin noise with gradient fills and smooth bezier curves.

## Technique

- Perlin noise FBM (4 octaves) generates smooth, organic wave shapes — not random sine math
- Quadratic bezier curves between sample points for anti-aliased smoothness
- Gradient fills per layer with configurable colors (5 stops)
- Sheen highlights detected at wave peaks via local minima check
- Back-to-front rendering creates natural depth

## Parameters

| Param | Default | Description |
|-|-|-|
| `--wav-color-1` through `--wav-color-5` | Various | Wave layer colors |
| `--wav-speed` | `0.015` | Animation speed |
| `--wav-amplitude` | `60` | Wave height in pixels |
| `--wav-layers` | `6` | Number of wave layers |

## Usage

```html
<script src="script.js"></script>
```
