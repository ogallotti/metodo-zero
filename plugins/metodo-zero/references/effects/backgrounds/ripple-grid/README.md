# Ripple Grid

Grid of dots with ripple waves propagating from mouse clicks. Each click spawns a wave that travels outward, displacing dot size and brightness. Supports up to 8 concurrent waves.

## When to use

- Interactive hero sections where user engagement matters
- Tech or data visualization landing pages
- Sections encouraging click interaction

## Integration

```html
<div class="rg-container">
  <canvas id="rg-canvas"></canvas>
  <div class="rg-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Click/touch spawns expanding ring waves
- Up to 8 concurrent waves with independent age and decay
- Dots near mouse hover glow brighter
- Auto-spawns 2 demo waves on load
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
