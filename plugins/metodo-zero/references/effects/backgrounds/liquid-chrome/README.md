# Liquid Chrome

GPU-rendered metallic liquid chrome using iterative sine wave domain distortion in a WebGL fragment shader.

## Technique

- 10 iterations of sin/cos UV warping create complex organic distortion
- Chrome look from `baseColor / abs(sin(time - uv.y - uv.x))` with Reinhard tone mapping
- Mouse-reactive ripple via point distortion with exponential falloff
- 3x3 supersampling for smooth, anti-aliased output
- Fully configurable base color, speed, amplitude, and frequency

## Parameters

| Param | Default | Description |
|-|-|-|
| `--lc-base-color` | `#4488ff` | Chrome base color |
| `--lc-speed` | `0.4` | Animation speed |
| `--lc-amplitude` | `1.0` | Distortion amplitude |
| `--lc-frequency-x` | `3.0` | Horizontal frequency |
| `--lc-frequency-y` | `4.0` | Vertical frequency |

## Usage

```html
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```
