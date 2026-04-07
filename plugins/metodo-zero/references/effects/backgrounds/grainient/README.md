# Grainient

WebGL shader combining a warped 4-color gradient with layered organic noise grain. The grain is flowing and animated, not flat static noise.

## When to use

- Trendy, editorial-style hero sections
- Product pages needing a textured, organic feel
- Anywhere a gradient alone feels too flat and digital

## Integration

```html
<div class="grn-container">
  <canvas class="grn-canvas"></canvas>
  <div class="grn-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Simplex noise used for both grain and gradient warping
- 4 noise octaves for grain at different scales create organic depth
- Film grain overlay layer adds extra texture
- Mouse position subtly influences the gradient warp
