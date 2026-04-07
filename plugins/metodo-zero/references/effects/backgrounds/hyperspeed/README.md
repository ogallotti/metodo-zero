# Hyperspeed

WebGL hyperspace speed lines radiating from a configurable center. Noise-modulated streak widths, moving light points along each streak, and bloom glow create a cinematic jump-to-lightspeed effect.

## When to use

- Hero sections with a sci-fi, speed, or energy theme
- Launch and countdown pages
- Gaming and entertainment backgrounds

## Integration

```html
<div class="hs-container">
  <canvas id="hs-canvas"></canvas>
  <div class="hs-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Two streak layers: fine primary + broad accent glow
- Each streak has animated light points traveling outward
- Noise-modulated width prevents uniform look
- Bloom via intensity squaring/cubing
- Pulsating center glow
- Color shifts from base color toward white at high intensity
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
