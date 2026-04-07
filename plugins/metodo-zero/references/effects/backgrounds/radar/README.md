# Radar

Radar sweep effect with concentric rings, rotating sweep line, and blips that appear as the sweep passes. Cyberpunk/tech aesthetic with green-on-dark by default.

## When to use

- Hero sections for security, monitoring, or data tools
- Landing pages with a tech/cyberpunk aesthetic
- Dashboards or status pages

## Integration

```html
<div class="rd-container">
  <canvas id="rd-canvas"></canvas>
  <div class="rd-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 5 concentric rings with cross-hair lines
- Rotating sweep with fading trail
- 12 blips at fixed positions, revealed by sweep and fading
- Scanline and CRT curvature effects
- Customizable color for different moods (green, blue, red)
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
