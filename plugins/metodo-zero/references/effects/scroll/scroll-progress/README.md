# Scroll Progress

Progress bar fixed at the top of the page that tracks scroll position.

## Usage

Include `style.css` and `script.js`. The bar auto-creates its own DOM elements on load.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--progress-height` | `4px` | Bar height |
| `--progress-color` | `#6366f1` | Bar fill color |
| `--progress-bg` | `transparent` | Track background |
| `--progress-z` | `9999` | Z-index |

## Accessibility

- `role="progressbar"` with `aria-valuenow` updated on scroll
- Respects `prefers-reduced-motion`
