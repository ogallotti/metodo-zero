# Grid Distortion

WebGL wireframe grid with FBM noise-based displacement, mouse-reactive distortion bubble, and glowing intersections.

## When to use

- Tech/engineering hero sections
- Backgrounds with a futuristic, digital aesthetic
- Sections where a matrix/grid metaphor reinforces the brand

## Integration

```html
<div class="gd-container">
  <canvas id="gd-canvas"></canvas>
  <div class="gd-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Grid lines drawn via SDF (distance to nearest integer boundary)
- FBM noise displaces grid coordinates for organic waviness
- Mouse creates a push-away distortion bubble
- Intersections glow brighter than lines, especially near mouse
- Smooth mouse tracking with interpolation prevents jitter
- All computation runs on GPU -- no JS per-cell logic
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
