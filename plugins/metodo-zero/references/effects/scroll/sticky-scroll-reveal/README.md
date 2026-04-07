# Sticky Scroll Reveal

Sticky sidebar with content that changes on scroll.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

Two-column grid: `.ssr-left` holds the sticky visual, `.ssr-right` holds scrolling `.ssr-step` content blocks. The visual updates its data-step attribute as different steps enter the viewport.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--sticky-bg` | `#0a0a1a` | Background |
| `--sticky-accent` | `#6366f1` | Accent color |
| `--sticky-text-color` | `#ffffff` | Text color |

## Accessibility

- Transitions disabled with `prefers-reduced-motion`
- Content remains readable in all states
