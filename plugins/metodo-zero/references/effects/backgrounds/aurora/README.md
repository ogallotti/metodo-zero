# Aurora Borealis

GPU-powered aurora effect using 2D simplex noise in a WebGL fragment shader.

## Technique

- Simplex noise FBM generates a height field that drives aurora band positions
- Three configurable color stops blended via exponential Gaussian falloff
- Vertical streak patterns from high-frequency noise (aurora curtain folds)
- Mouse interaction warps band positions with smooth exponential decay
- Shimmer overlay from fine-grained noise

## Parameters

| Param | Default | Description |
|-|-|-|
| `--aurora-color-1` | `#00d4aa` | First color stop |
| `--aurora-color-2` | `#7b2ff7` | Second color stop |
| `--aurora-color-3` | `#00b4d8` | Third color stop |
| `--aurora-speed` | `0.4` | Animation speed multiplier |
| `--aurora-amplitude` | `0.6` | Noise amplitude |
| `--aurora-blend` | `0.5` | Aurora intensity blend |

## Usage

```html
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```
