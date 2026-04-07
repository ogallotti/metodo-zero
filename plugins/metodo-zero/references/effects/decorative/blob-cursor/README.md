# Blob Cursor

Large soft gradient blob that follows cursor with smooth elastic easing, creating a liquid-like ambient effect.

## Usage

Add a `<div class="bc-blob"></div>` element. The script handles all positioning and animation.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--bc-color-1` | `#6366f1` | Primary gradient color |
| `--bc-color-2` | `#ec4899` | Secondary gradient color |
| `--bc-size` | `300px` | Blob diameter |
| `--bc-blur` | `80px` | Gaussian blur amount |
| `--bc-opacity` | `0.6` | Blob opacity |

## Accessibility

Hidden when `prefers-reduced-motion: reduce` is active.
