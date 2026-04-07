# Spotlight

Cursor-following spotlight with dual-color glow, grid reveal mask, ring border, and smooth interpolated tracking.

## When to use

- Hero sections where cursor interaction adds premium feel
- Dark backgrounds needing a subtle interactive element
- Sections with card layouts where spotlight reveals hidden grid

## Integration

```html
<div class="spt-container">
  <div class="spt-ambient"></div>
  <div class="spt-grid"></div>
  <div class="spt-light"></div>
  <div class="spt-light-2"></div>
  <div class="spt-ring"></div>
  <div class="spt-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Uses CSS `mask-image` on the grid to reveal only around cursor
- Dual spotlights: primary follows cursor directly, secondary trails behind with offset
- Smooth interpolation via requestAnimationFrame prevents jitter
- Spotlight fades in/out on hover and touch
- Touch support included with `.spt-touch-active` class toggle
