# Number Counter Scroll

Numbers count up when section scrolls into view.

## Dependencies

None — uses IntersectionObserver and requestAnimationFrame.

## Usage

Add `data-target` to `.stat-number` elements inside `.stats-grid`. Optional attributes: `data-suffix`, `data-prefix`, `data-decimals`.

## Data Attributes

| Attribute | Description |
|-|-|
| `data-target` | Target number value |
| `data-suffix` | Text appended after number (e.g., "%", "+") |
| `data-prefix` | Text prepended before number (e.g., "$") |
| `data-decimals` | Number of decimal places (default: 0) |

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--counter-color` | `#6366f1` | Number color |
| `--counter-bg` | `#0a0a1a` | Section background |
| `--counter-duration` | `1500ms` | Animation duration |

## Accessibility

- Numbers set immediately without animation with `prefers-reduced-motion`
