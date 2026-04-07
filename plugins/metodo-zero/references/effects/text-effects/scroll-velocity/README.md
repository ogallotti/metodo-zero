# Scroll Velocity

Text marquee that moves horizontally and accelerates based on scroll velocity. Supports multiple rows with opposite directions.

## Usage

```html
<div class="sv-section" data-base-speed="1" data-scroll-multiplier="3">
  <div class="sv-track">
    <span class="sv-item">Word</span>
    <span class="sv-separator">/</span>
  </div>
  <div class="sv-track sv-track-reverse">
    <span class="sv-item sv-item-stroke">Outline Word</span>
    <span class="sv-separator">/</span>
  </div>
</div>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--sv-font-size` | `6rem` | Font size |
| `--sv-color` | `rgba(255,255,255,0.08)` | Fill color |
| `--sv-stroke-color` | `rgba(255,255,255,0.15)` | Stroke outline color |
| `--sv-gap` | `2rem` | Gap between items |
| `--sv-bg` | `#0a0a0a` | Background color |

## Features

- Scroll velocity multiplier
- Opposing directions for visual depth
- Filled and outlined text variants
- Seamless looping
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
