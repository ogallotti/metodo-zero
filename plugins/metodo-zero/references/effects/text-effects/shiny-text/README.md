# Shiny Text

Text with a metallic shiny sweep animation. Pure CSS with optional metallic gradient base.

## Usage

```html
<h1 class="sn-text">Basic shine.</h1>
<h1 class="sn-text sn-text-metallic">Metallic shine.</h1>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--sn-font-size` | `4.5rem` | Font size |
| `--sn-color` | `#94a3b8` | Base color |
| `--sn-shine-color` | `#ffffff` | Shine highlight color |
| `--sn-shine-width` | `120px` | Width of shine beam |
| `--sn-speed` | `3s` | Sweep speed |
| `--sn-delay` | `1s` | Delay between sweeps |
| `--sn-bg` | `#0a0a0a` | Background color |

## Features

- Pure CSS shine sweep
- Optional metallic gradient base
- Configurable shine width and speed
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
