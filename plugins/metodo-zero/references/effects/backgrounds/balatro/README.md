# Balatro

Psychedelic domain-warped background effect rendered via WebGL shader. Multiple layers of sin/cos distortion create a hypnotic, undulating pattern mapped to a 4-color gradient.

## When to use

- Gaming or entertainment landing pages
- Creative portfolio hero sections
- Sections needing a bold, psychedelic atmosphere

## Integration

```html
<div class="bal-container">
  <canvas class="bal-canvas"></canvas>
  <div class="bal-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- WebGL shader with 4-layer domain warping for deep visual complexity
- Mouse position subtly distorts the pattern near the cursor
- Adjust `--bal-warp` for intensity: lower = subtle, higher = wild
- Falls back to static gradient on reduced-motion preference
