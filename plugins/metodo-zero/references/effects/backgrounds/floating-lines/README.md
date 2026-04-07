# Floating Lines

Gently drifting semi-transparent diagonal lines that float across the screen. Subtle, elegant, and non-distracting.

## When to use

- Minimal hero sections needing a subtle animation layer
- Corporate or SaaS landing pages
- Dark-themed sections where subtlety is key

## Integration

```html
<div class="fln-container">
  <canvas class="fln-canvas"></canvas>
  <div class="fln-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Canvas 2D with gradient-edged lines for soft appearance
- Lines wrap around screen edges seamlessly
- Very lightweight — excellent performance even on low-end devices
- Angle oscillation prevents robotic-looking movement
