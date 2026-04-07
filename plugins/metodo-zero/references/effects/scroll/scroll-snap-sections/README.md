# Scroll Snap Sections

Full-page sections with smooth CSS snap scrolling and entrance animations.

## Usage

Wrap `.snap-section` elements inside `.snap-container`. Add `#snapDots` container for auto-generated dot navigation. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--snap-transition-duration` | `0.6s` | Duration of entrance animations |
| `--snap-behavior` | `mandatory` | Snap type (`mandatory` or `proximity`) |
| `--snap-accent` | `#06b6d4` | Accent color for active dot and labels |

## Accessibility

- All animations disabled when `prefers-reduced-motion: reduce` is active
- Scroll snapping also disabled for reduced motion
- Dot navigation uses proper `aria-label` attributes
