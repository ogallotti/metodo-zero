# Shape Grid

Grid of geometric shapes that react to cursor proximity. Shapes near the mouse rotate, scale up, and glow. A trailing effect persists as the cursor moves.

## When to use

- Interactive hero sections where engagement matters
- Design tool or creative platform landing pages
- Sections demonstrating interactivity or responsiveness

## Integration

```html
<div class="shg-container">
  <canvas class="shg-canvas"></canvas>
  <div class="shg-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Shape type is configurable: circle, square, triangle, or diamond
- Trail stores recent mouse positions for a glowing wake effect
- Shapes animate smoothly with interpolation for organic feel
- Canvas shadowBlur provides the glow bloom on active shapes
