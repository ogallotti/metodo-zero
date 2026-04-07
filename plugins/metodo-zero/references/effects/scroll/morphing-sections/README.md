# Morphing Sections

Sections that morph shape as you scroll between them using clip-path transitions with organic shapes.

## Usage

Each `.morph-section` contains a `.morph-divider` element at the bottom. The script generates clip-path polygons based on scroll position using different shape presets (wave, blob, steps, zigzag). Include `style.css` and `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--morph-speed` | `1` | Speed multiplier for shape transitions |
| `--morph-color-1` | `#1e1b4b` | Background color section 1 |
| `--morph-color-2` | `#164e63` | Background color section 2 |
| `--morph-color-3` | `#3b0764` | Background color section 3 |
| `--morph-color-4` | `#1c1917` | Background color section 4 |

## Shape Presets

1. **Wave** — Sinusoidal curve with smooth peaks
2. **Blob** — Organic multi-frequency blob
3. **Steps** — Stepped/terraced edges
4. **Zigzag** — Sharp triangular teeth

## Accessibility

- Fixed clip-path applied when `prefers-reduced-motion: reduce` is active
- Uses passive scroll listeners
