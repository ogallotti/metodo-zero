# Light Pillar

WebGL shader rendering a vertical beam of light with multi-layer Gaussian glow, noise-driven flickering edges, volumetric rays, and sparkle particles.

## When to use

- Dramatic hero sections with a focal centerpiece
- Product reveal or launch pages
- Spiritual or futuristic themed sections

## Integration

```html
<div class="lpl-container">
  <canvas class="lpl-canvas"></canvas>
  <div class="lpl-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Beam edges flicker with multi-octave noise for organic feel
- Rotation parameter allows angling the beam
- Mouse X position subtly shifts the beam position
- Core is white-hot, transitioning to the gradient colors outward
