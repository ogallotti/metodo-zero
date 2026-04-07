# Dither

Ordered dithering with an 8x8 Bayer matrix applied to animated FBM noise fields. Multi-level dithering creates a retro/analog halftone aesthetic with 4 brightness levels.

## When to use

- Hero or section backgrounds for retro, indie, or analog brands
- Landing pages with a pixel-art or print aesthetic
- Backgrounds where a textured, non-smooth look is desired

## Integration

```html
<div class="dt-container">
  <canvas id="dt-canvas"></canvas>
  <div class="dt-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Full 8x8 Bayer matrix for proper ordered dithering
- 4-level brightness quantization for richer output
- FBM noise field as the source — animated, not static
- Customizable pattern scale (larger = more visible dither pattern)
- Scanline overlay for extra retro feel
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
