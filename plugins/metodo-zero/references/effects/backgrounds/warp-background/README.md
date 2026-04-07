# Warp Background

WebGL 3D starfield with multiple depth layers, radial streaking, twinkle, and mouse-driven parallax.

## When to use

- Hero sections with a space/sci-fi theme
- Launch pages and countdown screens
- Backgrounds needing a sense of speed and depth

## Integration

```html
<div class="wrp-container">
  <canvas id="wrp-canvas"></canvas>
  <div class="wrp-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 4 depth layers with parallax scrolling at different speeds
- Stars streak radially based on trail parameter
- Hash-based star placement in grid cells avoids clustering
- Twinkle via per-star phase animation
- Mouse parallax shifts layers at different rates
- Center glow creates a focal vanishing point
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
