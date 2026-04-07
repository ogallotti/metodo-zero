# Text Highlight on Scroll

Words in paragraphs progressively highlight (change color and opacity) as the user scrolls past them.

## Usage

Add the class `.th-highlight-text` to any paragraph. The script automatically wraps each word in a span and activates them based on scroll position. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--highlight-color` | `#a78bfa` | Color of highlighted words |
| `--highlight-inactive-opacity` | `0.2` | Opacity of inactive words |
| `--highlight-speed` | `1` | Speed multiplier for highlight progression |

## Accessibility

- Fully disabled when `prefers-reduced-motion: reduce` is active (all words visible)
- Uses passive scroll listeners for performance
