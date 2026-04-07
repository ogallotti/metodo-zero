# Color Bends

Flowing color bands that bend and weave like ribbons. Uses parametric curves (sine/cosine composites) for band centers with smooth distance field for width. 6 layered bands with glow and crossing highlights.

## When to use

- Hero sections for creative agencies or design tools
- Landing pages with vibrant, flowing energy
- Backgrounds where colorful motion creates visual interest

## Integration

```html
<div class="cb-container">
  <canvas id="cb-canvas"></canvas>
  <div class="cb-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 6 color bands with parametric spline-like paths
- Smooth distance field controls band width
- Intersection highlights where bands cross
- Soft glow halos around each band
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
