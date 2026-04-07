# Split Text

Splits text into individual characters or words and animates each with a stagger delay. Triggered on scroll into view.

## Usage

```html
<h1 class="st-text" data-split-by="chars" data-direction="up">
  Your headline here.
</h1>
```

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--st-font-size` | `4rem` | Font size |
| `--st-color` | `#ffffff` | Text color |
| `--st-stagger` | `0.03s` | Delay between each element |
| `--st-duration` | `0.6s` | Animation duration |
| `--st-distance` | `40px` | Travel distance |
| `--st-bg` | `#0a0a0a` | Background color |

## Data Attributes

- `data-split-by`: `chars` or `words`
- `data-direction`: `up`, `down`, `left`, `right`

## Features

- Split by characters or words
- Four direction options
- Configurable stagger timing
- IntersectionObserver scroll trigger
- prefers-reduced-motion support
- Mobile responsive
