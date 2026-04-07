# Hyperspeed

Hyperspace speed lines radiating from a configurable center with bloom glow, per-line gradients, and motion blur.

## When to use

- Hero sections with a sci-fi, speed, or energy theme
- Launch and countdown pages
- Gaming and entertainment backgrounds

## Integration

```html
<div class="hs-container">
  <canvas class="hs-canvas"></canvas>
  <div class="hs-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Each line has unique angle, speed, color, and length for organic variation
- Lines are drawn as gradient strokes: transparent at tail, bright at head
- Center bloom adds a bright focal point
- Motion blur via semi-transparent fill creates natural streaking
- Performance-heavy with 300+ lines; reduce `lineCount` on mobile
