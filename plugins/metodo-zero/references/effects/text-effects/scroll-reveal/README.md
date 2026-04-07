# Scroll Reveal

Text elements animate in staggered fashion as you scroll into view. Multiple animation presets for different section types.

## Usage

```html
<div class="sr-section">
  <h2 class="sr-item sr-heading" data-sr="fade-up">Title</h2>
  <p class="sr-item sr-text" data-sr="fade-up">Content</p>
</div>
```

## Animation Presets

- `fade-up` — Fade in from below
- `fade-down` — Fade in from above
- `fade-left` — Fade in from right
- `fade-right` — Fade in from left
- `scale` — Fade in with scale
- `rotate` — Fade in with slight rotation

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--sr-font-size` | `2.5rem` | Heading size |
| `--sr-color` | `#ffffff` | Text color |
| `--sr-muted` | `rgba(255,255,255,0.5)` | Body text color |
| `--sr-duration` | `0.8s` | Animation duration |
| `--sr-stagger` | `0.1s` | Stagger between items |
| `--sr-distance` | `30px` | Travel distance |
| `--sr-bg` | `#0a0a0a` | Background color |

## Features

- Six animation presets
- Section-level staggering
- Works with any element
- IntersectionObserver fires once per section
- prefers-reduced-motion support
- Mobile responsive
