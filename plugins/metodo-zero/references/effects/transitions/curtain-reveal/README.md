# Curtain Reveal

Curtain opening effect revealing the next section.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

`.curtain-wrapper` contains a sticky `.curtain-stage` with `.curtain-left`, `.curtain-right`, and `.curtain-content`. The wrapper height (200vh) controls how much scrolling is needed to fully open the curtain.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--curtain-color` | `#1a1a2e` | Curtain panel color |
| `--curtain-bg` | `#0a0a1a` | Page background |

## Accessibility

- Curtain panels hidden and content visible with `prefers-reduced-motion`
