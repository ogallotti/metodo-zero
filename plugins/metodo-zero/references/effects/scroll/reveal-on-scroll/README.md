# Reveal on Scroll

Elements reveal with various animations as they enter the viewport, configurable per-element with data attributes.

## Usage

Add `data-reveal` to any element with one of: `slide-up`, `slide-left`, `slide-right`, `fade`, `scale`, `rotate`. Optionally add `data-reveal-delay` (ms) and `data-reveal-stagger` (index) for sequenced animations. Include `style.css` and `script.js`.

## Data Attributes

| Attribute | Values | Description |
|-|-|-|
| `data-reveal` | `slide-up`, `slide-left`, `slide-right`, `fade`, `scale`, `rotate` | Animation type |
| `data-reveal-delay` | Number (ms) | Custom delay before animation |
| `data-reveal-stagger` | Number (index) | Stagger index, multiplied by `--reveal-stagger` |

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--reveal-duration` | `0.6s` | Animation duration |
| `--reveal-threshold` | `0.15` | IntersectionObserver threshold |
| `--reveal-distance` | `40px` | Slide distance for slide animations |
| `--reveal-stagger` | `80ms` | Base stagger delay between elements |

## Accessibility

- All animations disabled when `prefers-reduced-motion: reduce` is active
- Uses IntersectionObserver (no scroll hijacking)
