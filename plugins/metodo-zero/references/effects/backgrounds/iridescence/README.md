# Iridescence

GPU-rendered holographic iridescence using iterative cosine accumulation in a WebGL fragment shader.

## Technique

- 8-iteration cosine/sine accumulation loop builds organic spectral color patterns
- `a += cos(i - d - a*uv.x)` and `d += sin(uv.y*i + a)` create self-referencing feedback
- Color built from `cos(uv * vec3(d, a, d)) * 0.6 + 0.4` — full spectrum output
- Mouse shifts UV center for interactive exploration
- Configurable color tint blends with the raw iridescent output

## Parameters

| Param | Default | Description |
|-|-|-|
| `--iri-tint` | `#6366f1` | Color tint overlay |
| `--iri-speed` | `0.3` | Animation speed |
| `--iri-amplitude` | `1.0` | Pattern amplitude |

## Usage

```html
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```
