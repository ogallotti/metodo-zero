# Tracing Beam

Beam/line that draws along the page as you scroll, connecting content sections.

## Dependencies

None — pure vanilla JS with requestAnimationFrame.

## Usage

Place `.beam-block` elements inside `.beam-container`. The beam line and dot are created in the `.beam-line` element. Blocks get a `.passed` class as the beam reaches them.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--beam-color` | `#6366f1` | Beam and dot color |
| `--beam-width` | `2px` | Line width |
| `--beam-glow` | `8px` | Glow radius |
| `--beam-dot-size` | `12px` | Leading dot size |

## Accessibility

- Beam fills completely and dot hidden with `prefers-reduced-motion`
