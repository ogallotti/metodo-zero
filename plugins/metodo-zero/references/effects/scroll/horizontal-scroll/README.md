# Horizontal Scroll

Section scrolls horizontally while the page scrolls vertically.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

Place `.hscroll-panel` elements inside `.hscroll-track` inside `.hscroll-wrapper`. GSAP pins the wrapper and translates vertical scroll to horizontal panel movement.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--hscroll-bg` | `#0a0a1a` | Wrapper background |
| `--hscroll-panel-gap` | `24px` | Gap between panels |
| `--hscroll-panel-radius` | `16px` | Panel border radius |

## Accessibility

- Falls back to vertical stacked layout with `prefers-reduced-motion`
