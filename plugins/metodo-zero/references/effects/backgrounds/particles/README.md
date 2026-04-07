# Particles Constellation

Interactive particle system with constellation-style connecting lines and mouse repulsion.

## When to use

- Hero sections for tech/SaaS products
- Interactive backgrounds where user engagement matters
- Sections with a network/connection visual metaphor

## Integration

```html
<div class="ptc-container">
  <canvas class="ptc-canvas"></canvas>
  <div class="ptc-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Canvas is DPR-aware for crisp rendering on Retina displays
- Particle count auto-adjusts on mobile for smooth performance
- Mouse repulsion creates an organic, responsive feel
- IntersectionObserver pauses animation when offscreen
- Touch support included for mobile devices
