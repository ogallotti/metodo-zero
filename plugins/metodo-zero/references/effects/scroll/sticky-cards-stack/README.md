# Sticky Cards Stack

Cards stack on top of each other as you scroll, creating a layered deck effect.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

Place `.stack-card` elements inside `.stack-wrapper`. Cards use CSS `position: sticky` with GSAP-driven scale and opacity transitions.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--stack-bg` | `#f0f0f5` | Page background |
| `--stack-card-radius` | `16px` | Card border radius |
| `--stack-offset` | `30px` | Vertical offset between stacked cards |

## Accessibility

- Falls back to normal document flow with `prefers-reduced-motion`
