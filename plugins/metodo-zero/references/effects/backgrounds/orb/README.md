# Orb

Large, soft-edge gradient sphere centered on the page. Multiple color layers blend with a breathing animation. Purely CSS with gradient radials and blur, enhanced by JS mouse parallax.

## When to use

- Hero sections for minimal, elegant brands
- Landing pages where a subtle focal point is needed
- Sections with clean, modern aesthetics

## Integration

```html
<div class="orb-container">
  <div class="orb-sphere">
    <div class="orb-layer orb-layer--1"></div>
    <div class="orb-layer orb-layer--2"></div>
    <div class="orb-layer orb-layer--3"></div>
  </div>
  <div class="orb-content">
    <!-- Your content here -->
  </div>
</div>
<script src="script.js"></script>
```

## Notes

- CSS-only visual — no Canvas or WebGL required
- JS adds mouse/touch parallax with smooth lerp
- 3 gradient layers with different offsets and scales
- Breathing animation gives organic life
- IntersectionObserver pauses parallax when offscreen
- Respects `prefers-reduced-motion`
