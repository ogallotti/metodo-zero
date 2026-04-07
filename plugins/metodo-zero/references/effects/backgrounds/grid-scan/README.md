# Grid Scan

A uniform grid with a horizontal scanning line that sweeps downward, illuminating cells with a configurable glow that fades over time.

## When to use

- Sci-fi or tech-themed hero sections
- Dashboard or data visualization backgrounds
- Security or monitoring product pages

## Integration

```html
<div class="gsc-container">
  <canvas class="gsc-canvas"></canvas>
  <div class="gsc-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Scan line loops continuously from top to bottom
- Each cell stores its own glow state and fades independently
- Glow duration controls how long cells stay lit after the scan passes
- Canvas shadowBlur provides the bloom effect on active cells
