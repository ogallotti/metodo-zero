# Soft Aurora

Softer, more diffuse version of aurora using FBM noise with gentle gradient transitions. Pastel colors by default, less dramatic than aurora, more ambient and calming.

## When to use

- Hero or section backgrounds for wellness, meditation, or lifestyle brands
- Landing pages requiring calm, ambient atmosphere
- Sections where subtlety is preferred over drama

## Integration

```html
<div class="sa-container">
  <canvas id="sa-canvas"></canvas>
  <div class="sa-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 5-octave FBM with quintic smoothing for extra-soft transitions
- 3 aurora bands at different heights with independent motion
- Diffuse vertical glow and subtle shimmer overlay
- Pastel color palette by default
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
