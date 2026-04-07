# Cards Cascade

Cards waterfall into view from alternating sides with stagger delay, creating a dynamic and energetic scroll experience.

## Usage

Add `.cascade-card` elements with `data-cascade="left"` or `data-cascade="right"` inside `.cascade-container`. The script detects viewport entry and staggers the entrance animations. Include `style.css` and `script.js`.

## Data Attributes

| Attribute | Values | Description |
|-|-|-|
| `data-cascade` | `left`, `right` | Direction the card slides in from |

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--cascade-stagger` | `80ms` | Delay between consecutive card animations |
| `--cascade-slide-distance` | `100px` | How far cards travel during entrance |
| `--cascade-accent` | `#f59e0b` | Accent color for headings and numbers |

## Accessibility

- All animations disabled when `prefers-reduced-motion: reduce` is active
- Uses IntersectionObserver (no scroll hijacking)
- Cards fall back to vertical slide on mobile
