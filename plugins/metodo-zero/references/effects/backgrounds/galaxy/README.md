# Galaxy

Spiral galaxy with 4 log-spiral arms, thousands of scattered stars, nebula dust, and color temperature gradient (blue core to warm edges). Slow rotation.

## When to use

- Hero sections for space, tech, or science brands
- Landing pages for apps or products with cosmic themes
- Backgrounds where depth and grandeur are desired

## Integration

```html
<div class="gx-container">
  <canvas id="gx-canvas"></canvas>
  <div class="gx-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Log-spiral equation for realistic arm positions
- 3 layers of star scatter with brightness variation and twinkling
- Color temperature gradient: blue at core, warm at edges
- Noise-based nebula dust clouds along spiral arms
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
