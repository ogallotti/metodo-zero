# Dot Grid

Interactive dot grid where dots respond to cursor proximity with displacement, scaling, glow, and color shift.

## When to use

- Tech/SaaS hero sections with a minimal, structured feel
- Backgrounds that need subtle interactivity without being overwhelming
- Sections where a grid/matrix metaphor fits the brand

## Integration

```html
<div class="dg-container">
  <canvas class="dg-canvas"></canvas>
  <div class="dg-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Dots are pushed away from cursor with smooth spring-like return
- Dots near cursor grow, brighten, and shift toward glow color
- Ambient sine wave gives subtle movement even without cursor interaction
- Grid auto-adjusts to viewport size on resize
