# Cursor Trail

Glowing particle trail that follows the cursor with fading afterglow. Canvas-based for high performance.

## Usage

Add a `<canvas class="ct-canvas">` element. The script auto-initializes and tracks mouse movement.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--ct-color` | `#6366f1` | Trail color |
| `--ct-glow-size` | `30px` | Glow radius |
| `--ct-fade-speed` | `0.92` | Fade persistence (higher = longer trails) |

## JS Parameters

| Param | Default | Description |
|-|-|
| `trailLength` | `30` | Max trail length |
| `particleCount` | `3` | Particles spawned per frame |

## Accessibility

Fully respects `prefers-reduced-motion` — canvas is hidden when reduced motion is preferred.
