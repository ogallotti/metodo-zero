# Confetti

Colorful confetti burst animation triggered on click or automatically. Canvas-based with physics simulation.

## Usage

Add a `<canvas class="cf-canvas">` and optionally a trigger button with class `cf-btn`. Clicking anywhere fires confetti.

## JS Parameters

| Param | Default | Description |
|-|-|
| `particleCount` | `80` | Particles per burst |
| `gravity` | `0.5` | Gravity strength |
| `spread` | `70` | Cone spread angle |

## API

- `window.__confettiBurst(x, y)` — trigger burst at coordinates

## Accessibility

Canvas is hidden when `prefers-reduced-motion: reduce` is active.
