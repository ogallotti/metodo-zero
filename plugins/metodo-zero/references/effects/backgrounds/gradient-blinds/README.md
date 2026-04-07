# Gradient Blinds

CSS-animated horizontal strips resembling venetian blinds. Each strip has a gradient that shifts at a different speed and direction, creating a mesmerizing layered effect.

## When to use

- Creative agency hero sections
- Music or entertainment pages
- Sections wanting a bold, kinetic gradient feel

## Integration

```html
<div class="gbl-container" id="gbl-container">
  <div class="gbl-blinds" id="gbl-blinds"></div>
  <div class="gbl-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Strips are dynamically generated based on container height and strip-height param
- Mouse Y position causes nearby strips to expand and brighten
- Pure CSS animations — JS only for strip generation and interaction
- Falls back to static gradients on reduced-motion preference
