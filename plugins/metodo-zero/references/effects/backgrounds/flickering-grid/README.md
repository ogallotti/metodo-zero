# Flickering Grid

WebGL grid of independently flickering squares. Each cell has a unique phase and brightness, with mouse proximity accelerating flicker rate and boosting brightness.

## When to use

- Tech/data dashboard hero sections
- Backgrounds with a matrix/pixel aesthetic
- Sections needing a subtle, structured motion

## Integration

```html
<div class="fg-container">
  <canvas id="fg-canvas"></canvas>
  <div class="fg-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Entire grid computed on GPU -- no DOM cells, zero layout cost
- Hash functions give each cell unique phase, speed, and brightness
- Mouse proximity increases flicker rate (3x) and overall brightness
- Rounded corners on cells via SDF
- Radial vignette fades edges into background
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
