# Shimmer Text

Shimmering highlight sweeps across text. Pure CSS with minimal JS for visibility detection.

## Usage

```html
<h1 class="sh-text">Your headline here.</h1>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--sh-font-size` | `4rem` | Font size |
| `--sh-color` | `#71717a` | Base text color |
| `--sh-highlight` | `#ffffff` | Highlight color |
| `--sh-speed` | `2.5s` | Sweep speed |
| `--sh-width` | `40%` | Highlight width |
| `--sh-bg` | `#0a0a0a` | Background color |

## Features

- Pure CSS shimmer sweep
- Customizable highlight color and width
- IntersectionObserver pauses when offscreen
- prefers-reduced-motion support
- Mobile responsive
