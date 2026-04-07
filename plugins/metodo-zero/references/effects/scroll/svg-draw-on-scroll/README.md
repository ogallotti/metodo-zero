# SVG Draw on Scroll

SVG paths draw progressively as you scroll.

## Dependencies

None — uses native `getTotalLength()` and `strokeDashoffset`.

## Usage

Add `.draw-path` class to any SVG `<path>` or `<circle>` inside a `.svg-draw-wrapper`. The script calculates each path's length and animates `strokeDashoffset` based on scroll position.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--svg-stroke-color` | `#6366f1` | Path stroke color |
| `--svg-stroke-width` | `2` | Stroke width |
| `--svg-bg` | `#0a0a1a` | Background |

## Accessibility

- All paths drawn immediately with `prefers-reduced-motion`
