# Gradient Mesh

CSS-only animated mesh gradient with soft, organic color blobs and a subtle grain texture overlay.

## When to use

- Hero sections for creative, design-focused brands
- Backgrounds where a warm, organic feel is desired
- Sections where you want vibrant but not overwhelming color

## Integration

```html
<div class="gm-container">
  <div class="gm-mesh">
    <div class="gm-blob gm-blob--1"></div>
    <div class="gm-blob gm-blob--2"></div>
    <div class="gm-blob gm-blob--3"></div>
    <div class="gm-blob gm-blob--4"></div>
    <div class="gm-blob gm-blob--5"></div>
  </div>
  <div class="gm-grain"></div>
  <div class="gm-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Pure CSS — blobs are radial gradients with blur filter
- Grain overlay adds texture and prevents banding
- Each blob has a unique animation path and timing for natural feel
- Adjust `--gm-blur` to control softness of the mesh
