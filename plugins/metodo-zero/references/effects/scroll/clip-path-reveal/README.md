# Clip Path Reveal

Content reveals through animated clip-path on scroll with three shape variants.

## Dependencies

None — uses native IntersectionObserver and requestAnimationFrame.

## Variants

- Default: circle expanding from center
- `.clip-reveal--inset`: bottom-to-top inset reveal
- `.clip-reveal--polygon`: expanding triangle from bottom

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--clip-bg` | `#0a0a1a` | Page background |
| `--clip-reveal-color` | `#6366f1` | Accent reveal color |

## Accessibility

- Clip-path disabled and content visible immediately with `prefers-reduced-motion`
