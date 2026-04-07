# Light Rays

WebGL volumetric god-ray effect using radial blur accumulation with FBM noise for organic ray structure and floating dust particles.

## When to use

- Atmospheric hero sections with a cinematic look
- Dark-themed pages needing subtle, dramatic lighting
- Sections with a divine, ethereal, or mystical vibe

## Integration

```html
<div class="lr-container">
  <canvas id="lr-canvas"></canvas>
  <div class="lr-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 64-sample radial blur accumulation creates realistic god rays
- FBM noise modulates ray structure for organic variation
- Dust particles are GPU-computed with proximity-based brightness
- Source glow adds a light-source feel
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
