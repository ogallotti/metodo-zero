# Image Sequence Scrub

Scrub through procedurally generated canvas frames based on scroll position, like a video controlled by scroll.

## Usage

Add a `<canvas id="seqCanvas">` inside `.seq-canvas-wrapper`. The script renders a rotating 3D wireframe cube, mapped to scroll progress. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--seq-frame-count` | `60` | Total number of conceptual frames |
| `--seq-smoothing` | `0.08` | Lerp factor for frame interpolation |
| `--seq-accent` | `#6366f1` | Accent color for the wireframe |

## Accessibility

- Sticky canvas disabled when `prefers-reduced-motion: reduce` is active
- No external assets required — fully procedural
