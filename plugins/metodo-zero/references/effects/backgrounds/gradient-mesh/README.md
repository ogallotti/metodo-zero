# Gradient Mesh

WebGL fragment shader with 5 animated color blobs that drift organically, blended additively with a subtle film grain overlay.

## When to use

- Hero sections for creative, design-focused brands
- Backgrounds where a warm, organic feel is desired
- Sections where you want vibrant but not overwhelming color

## Integration

```html
<div class="gm-container">
  <canvas id="gm-canvas"></canvas>
  <div class="gm-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Real WebGL shader — blobs use smoothstep fields with additive blending
- Grain is generated in-shader via hash noise
- Soft tone mapping prevents color blowout
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
