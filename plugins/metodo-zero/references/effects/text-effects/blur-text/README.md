# Blur Text

Text appears from blur to sharp focus, staggered per character with a subtle upward motion.

## Usage

```html
<h1 class="bt-text">Your headline here.</h1>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--bt-font-size` | `4rem` | Font size |
| `--bt-color` | `#ffffff` | Text color |
| `--bt-blur-amount` | `12px` | Initial blur amount |
| `--bt-stagger` | `0.04s` | Stagger delay between characters |
| `--bt-duration` | `0.8s` | Animation duration |
| `--bt-bg` | `#0a0a0a` | Background color |

## Features

- Blur to sharp reveal per character
- Subtle scale and Y-axis motion
- IntersectionObserver scroll trigger
- prefers-reduced-motion support
- Mobile responsive
