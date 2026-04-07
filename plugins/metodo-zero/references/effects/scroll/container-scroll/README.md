# Container Scroll

Container transforms (scale, rotate, perspective) based on scroll position.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

Wrap `.transform-container` elements inside `.perspective-wrapper`. Each container rotates and scales as it enters and exits the viewport.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--container-bg` | `#0a0a1a` | Background |
| `--container-perspective` | `1000px` | CSS perspective value |
| `--container-max-rotate` | `8deg` | Maximum rotation angle |

## Accessibility

- All transforms disabled with `prefers-reduced-motion`
