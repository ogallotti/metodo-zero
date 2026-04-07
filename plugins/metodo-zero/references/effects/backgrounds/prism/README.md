# Prism

Light refraction/dispersion effect with a rotating triangular prism. White light beams split into rainbow bands through chromatic aberration, each color channel sampled at a different UV offset.

## When to use

- Hero sections for optics, photography, or design tools
- Landing pages with a Pink Floyd / scientific aesthetic
- Backgrounds emphasizing color and light

## Integration

```html
<div class="pr-container">
  <canvas id="pr-canvas"></canvas>
  <div class="pr-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Each color channel (R, G, B + orange, cyan, violet) sampled at different refraction angles
- Rotating prism SDF with edge glow
- Tone mapping prevents color blowout
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
