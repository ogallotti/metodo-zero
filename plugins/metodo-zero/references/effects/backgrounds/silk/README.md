# Silk

GPU-rendered flowing silk fabric using layered sine patterns at different rotations with film grain overlay.

## Technique

- Six sine pattern layers at different rotations and frequencies create organic fabric folds
- Rotated UV coordinates for each layer produce cross-weave effect
- Sheen highlights computed via pow() on luminance peaks
- Film grain from fract(sin(dot())*43758.5453) — classic shader noise
- All math runs on GPU at full resolution

## Parameters

| Param | Default | Description |
|-|-|-|
| `--silk-color` | `#6366f1` | Base silk color |
| `--silk-speed` | `0.3` | Animation speed |
| `--silk-scale` | `1.0` | Pattern scale |
| `--silk-rotation` | `0.0` | Base rotation (radians) |
| `--silk-noise-intensity` | `0.04` | Film grain intensity |

## Usage

```html
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```
