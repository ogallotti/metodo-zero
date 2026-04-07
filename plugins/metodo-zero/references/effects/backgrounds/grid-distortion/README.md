# Grid Distortion

Wireframe grid that warps and bends around the cursor, with smooth interpolated tracking and ambient wave motion.

## When to use

- Tech/engineering hero sections
- Backgrounds with a futuristic, digital aesthetic
- Sections where a matrix/grid metaphor reinforces the brand

## Integration

```html
<div class="gd-container">
  <canvas class="gd-canvas"></canvas>
  <div class="gd-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Grid lines brighten and shift color near cursor for a glowing effect
- Smooth mouse tracking with interpolation prevents jitter
- Ambient sine waves give life even without cursor interaction
- Grid auto-adjusts to viewport on resize
