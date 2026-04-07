# Parallax Hero Images

Hero section with multiple element layers at different parallax speeds creating a depth illusion.

## Usage

Place `.phero-layer` elements with `data-speed` attributes inside `.phero`. Each layer moves at a different rate based on its corresponding CSS variable. Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--hero-speed-1` | `0.1` | Speed for the farthest layer |
| `--hero-speed-2` | `0.2` | Speed for layer 2 |
| `--hero-speed-3` | `0.35` | Speed for layer 3 |
| `--hero-speed-4` | `0.5` | Speed for layer 4 |
| `--hero-speed-5` | `0.7` | Speed for the nearest layer |

## Accessibility

- Fully disabled when `prefers-reduced-motion: reduce` is active
- Uses GPU-accelerated `translate3d` transforms
- Passive scroll listeners for smooth performance
