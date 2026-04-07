# Glitch Text

Digital glitch/corruption effect with chromatic aberration using CSS clip-path and pseudo-elements.

## Usage

```html
<h1 class="gl-text">BREAK THE SYSTEM</h1>
<!-- Hover-only mode: -->
<h1 class="gl-text" data-hover-only="true">HOVER ME</h1>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--gl-font-size` | `5rem` | Font size |
| `--gl-color` | `#ffffff` | Text color |
| `--gl-color-r` | `#ff0040` | Red channel color |
| `--gl-color-b` | `#00d4ff` | Blue channel color |
| `--gl-intensity` | `6px` | Glitch displacement |
| `--gl-speed` | `3s` | Animation speed |
| `--gl-bg` | `#0a0a0a` | Background color |

## Features

- Chromatic aberration with red/blue channels
- Clip-path based glitch slices
- Continuous or hover-only mode
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
