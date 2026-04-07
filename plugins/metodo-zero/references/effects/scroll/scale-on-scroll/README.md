# Scale on Scroll

Elements scale up/down based on scroll position relative to viewport center.

## Dependencies

None — pure vanilla JS with requestAnimationFrame.

## Usage

Add `.scale-element` class to any element. It scales to `--scale-max` when centered in the viewport and shrinks to `--scale-min` at the edges.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--scale-min` | `0.7` | Scale when far from center |
| `--scale-max` | `1.1` | Scale when at viewport center |
| `--scale-bg` | `#0a0a1a` | Background |

## Accessibility

- All transforms disabled with `prefers-reduced-motion`
- Only GPU-friendly properties animated (transform, opacity)
