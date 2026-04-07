# Noise

WebGL animated film grain using multi-octave hash noise with scanlines, chromatic aberration, and a subtle color wash.

## When to use

- Any section needing a film-grain or analog texture
- Dark hero sections where gradients feel too clean
- Overlay on top of other effects for added texture

## Integration

```html
<div class="nz-container">
  <canvas id="nz-canvas"></canvas>
  <div class="nz-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Three hash functions at different scales for organic, non-pixelated grain
- Film-like flicker at 12fps seed changes
- Optional scanlines with horizontal flicker band
- Chromatic aberration shifts R/B grain offset and adds edge fringing
- Vignette and subtle color wash for depth
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
