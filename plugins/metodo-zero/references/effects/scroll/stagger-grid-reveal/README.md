# Stagger Grid Reveal

Grid items animate in with staggered timing as they enter the viewport.

## Dependencies

None — uses native IntersectionObserver.

## Usage

Wrap `.stagger-item` elements inside `.stagger-grid`. Items start invisible and animate in with a cascade effect when the grid scrolls into view.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--grid-columns` | `3` | Number of grid columns |
| `--grid-gap` | `24px` | Gap between items |
| `--grid-stagger` | `100ms` | Delay between each item |
| `--grid-duration` | `600ms` | Animation duration |
| `--grid-translate-y` | `40px` | Slide-up distance |

## Accessibility

- Items rendered immediately with `prefers-reduced-motion`
