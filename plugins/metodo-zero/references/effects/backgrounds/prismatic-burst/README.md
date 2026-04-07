# Prismatic Burst

WebGL shader rendering a prismatic light burst with 12-band spectral chromatic aberration. Each color channel refracts at a different angle from the center, creating rainbow halo rings.

## When to use

- Creative or artistic hero sections
- Album or media release pages
- Sections needing a dramatic, prismatic focal point

## Integration

```html
<div class="prb-container">
  <canvas class="prb-canvas"></canvas>
  <div class="prb-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- 12 spectral color bands sampled at different refraction offsets
- Visible spectrum approximation from violet through red
- Radial rays, ring highlights, and noise sparkles for visual richness
- Burst center follows mouse with smooth interpolation
