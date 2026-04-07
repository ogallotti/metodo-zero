# Liquid Chrome

Per-pixel metallic liquid chrome distortion using Canvas 2D shader simulation. No WebGL required.

## When to use

- Premium hero sections with a futuristic, high-end feel
- Product pages for tech/crypto/fintech
- Sections where a bold, attention-grabbing background is needed

## Integration

```html
<div class="lc-container">
  <canvas class="lc-canvas"></canvas>
  <div class="lc-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Performance-heavy: renders per-pixel with FBM noise. Uses reduced resolution (1/3) and upscales
- Adjust `scale` param: higher = better perf, lower = sharper image
- Mouse interaction adds localized distortion
- Falls back to a static gradient when `prefers-reduced-motion` is enabled
- On very low-end mobile, consider increasing `scale` to 4-6
