# Pin and Reveal

Section pins in place while content reveals and animates within.

## Dependencies

- GSAP 3.12+ with ScrollTrigger

## Usage

Wrap a `.pin-section` inside `.pin-wrapper`. Add `.pin-step` elements for each content step. Include GSAP and ScrollTrigger from CDN before `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--pin-bg` | `#0a0a1a` | Section background |
| `--pin-accent` | `#6366f1` | Accent color for dots and numbers |
| `--pin-text-color` | `#ffffff` | Text color |

## Accessibility

- Falls back to stacked static layout with `prefers-reduced-motion`
- Progress dots hidden in reduced-motion mode
