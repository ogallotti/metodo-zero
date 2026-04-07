# Timeline Scroll

Animated timeline that draws and fills as user scrolls, with nodes and alternating content cards.

## Usage

Create `.tl-timeline` with `.tl-item--left` and `.tl-item--right` children. Each item needs a `.tl-node` and `.tl-card`. The `.tl-line-track` and `.tl-line-fill` create the growing center line. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--tl-line-color` | `#6366f1` | Color of the timeline line |
| `--tl-node-color` | `#a78bfa` | Color of active nodes |
| `--tl-card-animation` | `slide` | Card entrance animation type |
| `--tl-line-width` | `3px` | Width of the timeline line |

## Accessibility

- All animations disabled when `prefers-reduced-motion: reduce` is active
- Timeline fills completely and all cards visible immediately
- Responsive layout collapses to single column on mobile
