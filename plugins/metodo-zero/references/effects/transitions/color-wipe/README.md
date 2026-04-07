# Color Wipe

Full color wipe transition between sections.

## Dependencies

None — CSS animations with IntersectionObserver trigger.

## Variants

- `.wipe-overlay--ltr`: Left-to-right sweep
- `.wipe-overlay--rtl`: Right-to-left sweep
- `.wipe-overlay--btt`: Bottom-to-top sweep

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--wipe-color` | `#6366f1` | Wipe overlay color |
| `--wipe-duration` | `700ms` | Full wipe cycle time |

## Accessibility

- Overlays hidden and content visible immediately with `prefers-reduced-motion`
