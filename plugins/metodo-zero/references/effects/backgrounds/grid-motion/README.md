# Grid Motion

Rows of rounded rectangles that shift horizontally based on cursor X position. Each row moves at a different speed and direction, creating a parallax-like effect with smooth inertia.

## When to use

- Portfolio or showcase hero sections
- Interactive backgrounds with mouse-driven parallax
- Sections where horizontal movement conveys energy

## Integration

```html
<div class="gmo-container">
  <canvas class="gmo-canvas"></canvas>
  <div class="gmo-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Items loop seamlessly as rows shift
- Inertia parameter controls how smoothly motion follows cursor
- Alternating row directions create visual depth
- Items vary in size and opacity for organic feel
