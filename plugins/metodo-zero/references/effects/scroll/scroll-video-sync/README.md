# Scroll Video Sync

A video-like experience driven by scroll. Canvas draws procedural animated content synced to scroll position.

## Usage

Wrap the sticky canvas in `.vsync-sticky-wrapper` (tall container) with `.vsync-sticky` (sticky inner). The canvas renders orbiting particles and expanding rings controlled by scroll. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--vsync-speed` | `1` | Speed multiplier for the animation |
| `--vsync-smoothing` | `0.06` | Lerp factor for scroll-to-frame interpolation |
| `--vsync-accent` | `#ec4899` | Accent color used throughout the animation |

## Accessibility

- Sticky positioning removed when `prefers-reduced-motion: reduce` is active
- No external video files — fully procedural
