# Ballpit

Soft-edged metaball blobs that merge and split organically. Uses the classic metaball SDF formula (sum of radius^2 / distance^2) with a threshold for smooth organic shapes. Mouse pushes balls away.

## When to use

- Hero sections for playful, creative brands
- Landing pages for apps targeting younger audiences
- Backgrounds where organic, lava-lamp-like motion is desired

## Integration

```html
<div class="bp-container">
  <canvas id="bp-canvas"></canvas>
  <div class="bp-content">
    <!-- Your content here -->
  </div>
</div>
<script src="../../_shared/gl-utils.js"></script>
<script src="script.js"></script>
```

## Notes

- 12 metaballs with different sizes and orbital paths
- Mouse/touch repels nearby balls
- Color blending weighted by field contribution
- Specular-like highlights at dense merge points
- IntersectionObserver pauses rendering when offscreen
- Respects `prefers-reduced-motion`
