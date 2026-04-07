# Typewriter

Types text character by character with a blinking cursor. Supports delete and retype loop through multiple phrases.

## Usage

```html
<span
  class="tw-text"
  data-phrases='["First phrase","Second phrase"]'
  data-type-speed="80"
  data-delete-speed="50"
  data-pause-between="2000"
  data-loop="true"
></span><span class="tw-cursor"></span>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--tw-font-size` | `3.5rem` | Font size |
| `--tw-color` | `#ffffff` | Text color |
| `--tw-cursor-color` | `#6ee7b7` | Cursor color |
| `--tw-cursor-width` | `3px` | Cursor width |
| `--tw-bg` | `#0a0a0a` | Background color |

## Features

- Character-by-character typing with natural speed variation
- Delete and retype loop through multiple phrases
- Blinking cursor animation
- IntersectionObserver pauses animation when offscreen
- prefers-reduced-motion support
- Mobile responsive
