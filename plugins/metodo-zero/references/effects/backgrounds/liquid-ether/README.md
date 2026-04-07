# Liquid Ether

Organic fluid-like patterns using FBM (fractal Brownian motion) with 5 octaves of noise and rotation between octaves. Mouse position warps the field for an interactive, ethereal, dreamy look.

## When to use

- Hero sections for wellness, creative, or luxury brands
- Backgrounds requiring a soft, organic atmosphere
- Landing pages with ambient, dreamlike visuals

## Integration

```html
<div class="le-container">
  <canvas id="le-canvas"></canvas>
  <div class="le-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 5-octave FBM with rotation between octaves for organic flow
- Mouse/touch warps the noise field
- Layered FBM creates recursive depth (noise of noise)
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
