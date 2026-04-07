# Aurora Borealis

CSS-only animated aurora borealis effect with layered gradient bands, shimmer overlay, and vignette.

## When to use

- Hero sections with a dark, ethereal atmosphere
- Landing pages for creative, tech, or SaaS products
- Sections where content overlays a dramatic background

## Integration

```html
<div class="aur-container">
  <div class="aur-glow">
    <div class="aur-band aur-band--1"></div>
    <div class="aur-band aur-band--2"></div>
    <div class="aur-band aur-band--3"></div>
    <div class="aur-band aur-band--4"></div>
  </div>
  <div class="aur-shimmer"></div>
  <div class="aur-vignette"></div>
  <div class="aur-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Pure CSS animation — no Canvas or JS required for the effect itself
- JS is only used for IntersectionObserver (pause when offscreen) and param updates
- Performance is excellent since it uses GPU-composited transforms and opacity
- Adjust `--aurora-blur` for subtlety: higher values = softer, dreamier look
