# Text Generate

Text appears word by word with a typing/generation effect, simulating AI text generation. Words start blurred and dim, then snap into focus sequentially.

## Usage

```html
<p class="tg-text" data-word-delay="80" data-show-cursor="true">
  Your paragraph text here word by word.
</p>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--tg-font-size` | `2rem` | Font size |
| `--tg-color` | `#ffffff` | Revealed text color |
| `--tg-dim-color` | `rgba(255,255,255,0.15)` | Unrevealed text color |
| `--tg-cursor-color` | `#6ee7b7` | Cursor color |
| `--tg-bg` | `#0a0a0a` | Background color |

## Features

- Word-by-word reveal with natural speed variation
- Blur-to-sharp transition per word
- Optional blinking cursor that follows the reveal
- Cursor fades out after completion
- IntersectionObserver scroll trigger (fires once)
- prefers-reduced-motion shows all text immediately
- Mobile responsive
