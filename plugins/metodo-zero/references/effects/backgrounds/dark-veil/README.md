# Dark Veil

Multiple semi-transparent dark fog layers with CSS drift animations and mouse-driven parallax displacement. Moody, atmospheric, and subtle.

## When to use

- Dark, atmospheric hero sections
- Horror or thriller themed pages
- Sections needing a mysterious, foggy overlay on existing content

## Integration

```html
<div class="dkv-container" id="dkv-container">
  <div class="dkv-layer dkv-layer--1"></div>
  <div class="dkv-layer dkv-layer--2"></div>
  <div class="dkv-layer dkv-layer--3"></div>
  <div class="dkv-layer dkv-layer--4"></div>
  <div class="dkv-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- 4 fog layers with different radial gradients, drift speeds, and parallax depths
- CSS animations handle the drifting, JS handles parallax offset from mouse
- Very lightweight — no canvas or WebGL required
- Fog color is dynamically applied via JS for full customization
