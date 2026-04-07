# Wave Divider

Animated SVG wave between sections.

## Dependencies

None — CSS animation with inline SVG.

## Usage

Add `.wave-divider` inside a section, positioned at the bottom. The SVG path is duplicated (two wave cycles) to enable seamless CSS `translateX` looping. Use `.wave-divider--reverse` for opposite direction.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--wave-height` | `100px` | Wave container height |
| `--wave-speed` | `12s` | Animation cycle duration |
| `--wave-color` | `#0a0a1a` | Default wave fill |

## Accessibility

- Animation paused with `prefers-reduced-motion`
