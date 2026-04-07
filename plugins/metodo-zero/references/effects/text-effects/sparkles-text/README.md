# Sparkles Text

Text with animated sparkle particles floating around it. SVG-based sparkles with configurable colors and density.

## Usage

```html
<div class="sp-wrapper" data-sparkle-count="20" data-sparkle-interval="300">
  <h1 class="sp-text">Your headline here.</h1>
</div>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--sp-font-size` | `4rem` | Font size |
| `--sp-color` | `#ffffff` | Text color |
| `--sp-sparkle-color-1` | `#fbbf24` | Gold sparkle |
| `--sp-sparkle-color-2` | `#f472b6` | Pink sparkle |
| `--sp-sparkle-color-3` | `#60a5fa` | Blue sparkle |
| `--sp-sparkle-size` | `10px` | Base sparkle size |
| `--sp-bg` | `#0a0a0a` | Background color |

## Features

- SVG sparkle particles with 4-point star
- Three customizable colors
- Configurable count and spawn rate
- Float and spin animation
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion hides all sparkles
- Mobile responsive
