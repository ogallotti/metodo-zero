# Beams

Animated light beams that radiate from a configurable focal point, with slow rotation and pulsing opacity.

## When to use

- Hero sections with a dramatic, spotlight feel
- Product launch or announcement pages
- Sections where you want to draw attention to a central element

## Integration

```html
<div class="bm-container">
  <canvas class="bm-canvas"></canvas>
  <div class="bm-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Uses `screen` composite mode for additive light blending
- Each beam has a unique width, length, color, speed, and phase
- Origin point is configurable with `originX`/`originY` (0..1)
- Beams are drawn as gradient-filled trapezoids for realistic divergence
