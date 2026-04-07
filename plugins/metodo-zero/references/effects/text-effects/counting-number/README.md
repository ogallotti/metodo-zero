# Counting Number

Animates numbers counting up from 0 to a target value when scrolled into view. Supports prefix, suffix, decimal places, and thousand separators.

## Usage

```html
<div class="cn-number"
  data-target="12500"
  data-duration="2000"
  data-suffix="+"
  data-prefix="$"
  data-decimals="0"
  data-separator=","
  data-easing="easeOut"
>0</div>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--cn-font-size` | `4rem` | Number size |
| `--cn-color` | `#ffffff` | Number color |
| `--cn-accent` | `#6ee7b7` | Prefix/suffix color |
| `--cn-label-color` | `rgba(255,255,255,0.5)` | Label color |
| `--cn-bg` | `#0a0a0a` | Background color |

## Features

- Count up from 0 to target
- Three easing options: linear, easeOut, easeInOut
- Prefix and suffix support
- Decimal places and thousand separators
- IntersectionObserver scroll trigger (fires once)
- prefers-reduced-motion: shows final value instantly
- Mobile responsive grid
