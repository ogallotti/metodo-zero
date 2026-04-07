# Threads

WebGL shader with 35 flowing lines using Perlin noise for Y displacement. Lines emerge from the left and converge at a point influenced by mouse position. Color gradient along each line.

## When to use

- Hero sections for tech or creative brands
- Backgrounds emphasizing flow and connectivity
- Landing pages with a dynamic, modern feel

## Integration

```html
<div class="th-container">
  <canvas id="th-canvas"></canvas>
  <div class="th-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Real WebGL shader with simplex noise displacement
- Mouse/touch moves the convergence point
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
