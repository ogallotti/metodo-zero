# Warp Background

Classic space warp starfield with 3D perspective projection, speed trails, and motion blur.

## When to use

- Hero sections with a space/sci-fi theme
- Launch pages and countdown screens
- Backgrounds needing a sense of speed and depth

## Integration

```html
<div class="wrp-container">
  <canvas class="wrp-canvas"></canvas>
  <div class="wrp-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Stars have Z-depth for perspective: distant stars are dimmer and smaller
- Trails are drawn from previous frame position to current for smooth streaks
- Semi-transparent clear creates natural motion blur
- Center point is configurable for off-center warp effects
- Speed can be cranked up for dramatic hyperspace feel
