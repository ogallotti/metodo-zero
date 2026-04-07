# Particles Constellation

Perlin noise-driven particle system with constellation connection lines and mouse repulsion.

## Technique

- 2D Perlin noise flow field drives particle velocity (not random walk)
- Each particle has unique noise offsets for organic, non-uniform movement
- Size pulsing via sine wave with random phase offset per particle
- Constellation lines drawn between nearby particles with distance-based alpha
- Mouse repulsion with smooth falloff pushes particles away from cursor
- Particle count auto-adjusts based on viewport area for consistent performance

## Parameters

| Param | Default | Description |
|-|-|-|
| `--ptc-particle-color` | `#ffffff` | Particle color |
| `--ptc-line-color` | `#ffffff` | Connection line color |
| `--ptc-glow-color` | `#64c8ff` | Mouse glow color |
| `--ptc-speed` | `0.4` | Movement speed |
| `--ptc-connect-distance` | `150` | Max distance for connection lines |
| `--ptc-mouse-radius` | `180` | Mouse repulsion radius |

## Usage

```html
<script src="script.js"></script>
```
