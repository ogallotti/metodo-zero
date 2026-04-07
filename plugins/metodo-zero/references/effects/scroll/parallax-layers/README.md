# Parallax Layers

Multiple layers moving at different speeds on scroll to create depth.

## Usage

Add `.parallax-section` containers with `.parallax-layer--bg` and `.parallax-layer--shapes` children. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--parallax-speed-bg` | `0.3` | Background layer speed multiplier |
| `--parallax-speed-mid` | `0.6` | Midground layer speed multiplier |

## Accessibility

- Fully disabled when `prefers-reduced-motion: reduce` is active
- Uses `translate3d` for GPU-accelerated transforms
