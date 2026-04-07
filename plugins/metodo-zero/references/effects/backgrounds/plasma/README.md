# Plasma

3D volumetric raymarching through a plasma field. Uses torus-like SDF with sin/cos domain warping for organic shapes. 60 raymarching steps accumulate color for a dense, fiery look.

## When to use

- Hero sections for gaming, creative, or futuristic brands
- Backgrounds requiring dramatic, high-impact visuals
- Pages where performance budget allows a heavier shader

## Integration

```html
<div class="pl-container">
  <canvas id="pl-canvas"></canvas>
  <div class="pl-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- Performance-heavy: 60-step raymarching per pixel
- Camera rotates slowly for depth perception
- Tone mapping prevents color blowout
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
