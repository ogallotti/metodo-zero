# Pointer Highlight

Radial gradient highlight centered on cursor position, creating a subtle spotlight effect.

## Usage

Add a `<div class="ph-spotlight"></div>` element. JS updates `--ph-x` and `--ph-y` on mousemove.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--ph-color` | `#6366f1` | Spotlight color |
| `--ph-size` | `400px` | Spotlight radius |
| `--ph-opacity` | `0.15` | Spotlight opacity |

## Accessibility

Hidden when `prefers-reduced-motion: reduce` is active.
