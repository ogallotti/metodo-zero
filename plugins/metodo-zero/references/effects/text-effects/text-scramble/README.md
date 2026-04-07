# Text Scramble

Scrambles and decodes text with random characters before revealing the final text. Cycles through multiple phrases.

## Usage

```html
<span
  class="ts-text"
  data-phrases='["First phrase","Second phrase"]'
  data-scramble-speed="30"
  data-reveal-delay="50"
  data-pause-between="3000"
></span>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--ts-font-size` | `3.5rem` | Font size |
| `--ts-color` | `#ffffff` | Final text color |
| `--ts-scramble-color` | `#6ee7b7` | Scrambling characters color |
| `--ts-bg` | `#0a0a0a` | Background color |

## Features

- Random character scramble before reveal
- Randomized reveal order for organic feel
- Cycles through multiple phrases
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
