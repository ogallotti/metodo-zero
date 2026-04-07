# Waves

Layered sine wave animation with gradient fills, stroke lines, and organic multi-frequency motion.

## When to use

- Section dividers with animated backgrounds
- Hero sections with a calm, flowing aesthetic
- Backgrounds for audio, music, or data visualization contexts

## Integration

```html
<div class="wav-container">
  <canvas class="wav-canvas"></canvas>
  <div class="wav-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Each wave uses multiple sine/cosine frequencies for organic movement
- Waves drawn back-to-front with gradient fills for depth
- Adjust `verticalCenter` and `verticalSpread` to position waves in the viewport
- Lightweight: only draws paths, no per-pixel computation
