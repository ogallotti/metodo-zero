# Morphing Text

Smoothly morphs between different words or phrases using blur and scale transitions.

## Usage

```html
<span class="mt-wrapper" data-phrases='["word1","word2","word3"]' data-pause-between="2500">
  <span class="mt-text-current mt-text"></span>
  <span class="mt-text-next mt-text"></span>
</span>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--mt-font-size` | `4.5rem` | Font size |
| `--mt-color` | `#ffffff` | Text color |
| `--mt-duration` | `0.8s` | Morph transition duration |
| `--mt-bg` | `#0a0a0a` | Background color |

## Features

- Blur morph transition between phrases
- Works inline with static text
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
