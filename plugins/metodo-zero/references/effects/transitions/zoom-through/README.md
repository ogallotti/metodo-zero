# Zoom Through

Zoom into element to transition to next section.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

`.zoom-wrapper` (300vh height) contains a sticky `.zoom-stage` with `.zoom-frame` (the zooming element) and `.zoom-revealed` (content behind it). Scroll drives the frame's scale from 1 to `--zoom-max-scale` while fading it out.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--zoom-bg` | `#0a0a1a` | Background |
| `--zoom-max-scale` | `15` | Maximum zoom scale before fade-out |

## Accessibility

- Zoom disabled and sections stacked normally with `prefers-reduced-motion`
- Content visible without animation in reduced-motion mode
