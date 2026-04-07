# Evil Eye

WebGL shader rendering a large pulsing eye/iris with concentric rings, radial fibers, and a pupil that smoothly tracks the mouse cursor.

## When to use

- Mysterious or dark-themed hero sections
- Security or surveillance product landing pages
- Any section needing a dramatic, watchful presence

## Integration

```html
<div class="eye-container">
  <canvas class="eye-canvas"></canvas>
  <div class="eye-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Pupil follows mouse with smooth interpolation for organic feel
- Ring count and pulse speed are fully configurable
- Falls back to radial gradient on reduced-motion preference
