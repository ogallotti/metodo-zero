# Light Rays

Volumetric CSS-only light rays streaming from a configurable origin point, with dust particles and fog.

## When to use

- Atmospheric hero sections with a cinematic look
- Dark-themed pages needing subtle, dramatic lighting
- Sections with a divine, ethereal, or mystical vibe

## Integration

```html
<div class="lr-container">
  <div class="lr-rays">
    <div class="lr-ray lr-ray--1"></div>
    <!-- ... up to lr-ray--12 -->
  </div>
  <div class="lr-dust"></div>
  <div class="lr-fog"></div>
  <div class="lr-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Pure CSS: rays are pseudo-elements with gradient fills, animated with rotation
- Dust particles are radial-gradient dots with slow floating animation
- Each ray has unique width, opacity, speed, and phase for natural variation
- Origin point can be repositioned via `--lr-origin-x` and `--lr-origin-y`
