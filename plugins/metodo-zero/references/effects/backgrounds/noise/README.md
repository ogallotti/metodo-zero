# Noise

Animated grain/noise texture overlay using SVG feTurbulence, with scanlines and vignette.

## When to use

- Any section needing a film-grain or analog texture
- Dark hero sections where gradients feel too clean
- Overlay on top of other effects for added texture

## Integration

```html
<div class="nz-container">
  <div class="nz-gradient"></div>
  <div class="nz-grain"></div>
  <div class="nz-grain-2"></div>
  <div class="nz-scanlines"></div>
  <div class="nz-vignette"></div>
  <div class="nz-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Grain is SVG-based via inline data URI — no external assets
- Animation uses `steps()` for a flickering, film-like feel
- Two noise layers with different seeds and frequencies create depth
- Scanlines and vignette are optional decorative layers
- Blend mode is configurable: `overlay` is default, try `soft-light` for subtlety
