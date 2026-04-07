# Text Reveal

Text reveals with a sliding colored mask/wipe effect. The mask sweeps in, text appears, then the mask sweeps out.

## Usage

```html
<div class="tr-container" data-direction="left">
  <span class="tr-line"><span class="tr-line-inner">Line one.</span></span>
  <span class="tr-line"><span class="tr-line-inner">Line two.</span></span>
</div>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--tr-font-size` | `4rem` | Font size |
| `--tr-color` | `#ffffff` | Text color |
| `--tr-accent` | `#6ee7b7` | Wipe mask color |
| `--tr-duration` | `0.8s` | Animation duration |
| `--tr-stagger` | `0.15s` | Stagger between lines |
| `--tr-bg` | `#0a0a0a` | Background color |

## Features

- Two-phase mask wipe: in then out
- Staggered per line
- Left or right direction
- IntersectionObserver scroll trigger
- prefers-reduced-motion support
- Mobile responsive
