# Rotating Text

Rotates and cycles through words with slide, fade, or flip animation modes.

## Usage

```html
<span
  class="rt-rotator"
  data-words='["word1","word2","word3"]'
  data-mode="slide"
  data-interval="2500"
></span>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--rt-font-size` | `4rem` | Font size |
| `--rt-color` | `#ffffff` | Static text color |
| `--rt-accent` | `#6ee7b7` | Rotating word color |
| `--rt-duration` | `0.5s` | Transition duration |
| `--rt-bg` | `#0a0a0a` | Background color |

## Modes

- `slide` — words slide up/down
- `fade` — words fade with scale
- `flip` — 3D flip rotation

## Features

- Three animation modes
- Auto-sizes to widest word
- Works inline with static text
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
