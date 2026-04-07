# Pixel Blast

Canvas 2D effect with hundreds of small pixel squares exploding outward from the center, drifting briefly, then reforming back — all in a smooth continuous loop.

## When to use

- Game or entertainment hero sections
- Product reveal moments
- Energetic, attention-grabbing backgrounds

## Integration

```html
<div class="pxb-container">
  <canvas class="pxb-canvas"></canvas>
  <div class="pxb-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Three-phase animation cycle: explode, drift, reform
- Each particle has unique angle, speed, delay, and rotation
- Exponential easing for explosive outward motion, cubic for smooth reform
- Center glow appears during the reform phase
