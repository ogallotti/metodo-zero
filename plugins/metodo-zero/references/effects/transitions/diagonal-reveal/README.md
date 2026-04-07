# Diagonal Reveal

Diagonal wipe transition between sections.

## Dependencies

None.

## Variants

- `.diag--left`: Top edge rises from left to right
- `.diag--right`: Top edge rises from right to left
- `.diag--bottom-left`: Bottom edge falls from left
- `.diag--bottom-right`: Bottom edge falls from right

Combine top and bottom diagonals on the same section for full angular framing.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--diag-angle` | `40px` | Height of the diagonal cut |

## Accessibility

- Clip-paths removed with `prefers-reduced-motion`
- Content shown immediately without fade animation
