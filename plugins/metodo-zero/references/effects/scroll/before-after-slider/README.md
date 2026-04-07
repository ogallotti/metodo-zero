# Before After Slider

Drag slider to compare two states side by side.

## Dependencies

None — uses Pointer Events API.

## Usage

Structure: `.ba-slider` containing `.ba-slider__before`, `.ba-slider__after`, and `.ba-slider__handle`. The after layer is clipped via CSS `clip-path: inset()`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--slider-handle-color` | `#ffffff` | Handle and divider color |
| `--slider-handle-width` | `3px` | Divider line width |
| `--slider-radius` | `12px` | Container border radius |

## Accessibility

- Full keyboard support (arrow keys)
- ARIA slider role with valuemin/valuemax/valuenow
- Works with touch, mouse, and stylus via Pointer Events
