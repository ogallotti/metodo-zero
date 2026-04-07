# Beams

WebGL light beams radiating from a configurable focal point. Multiple beam layers rotate at different speeds with bloom glow and mouse interaction.

## When to use

- Dramatic hero sections
- Product launch or announcement pages
- Dark-themed landing pages needing a cinematic look

## Integration

```html
<div class="bm-container">
  <canvas id="bm-canvas"></canvas>
  <div class="bm-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Three beam layers with different widths, speeds, and directions
- Bloom effect via intensity squaring
- Pulsating center glow adds a light-source feel
- Mouse proximity brightens nearby area
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
