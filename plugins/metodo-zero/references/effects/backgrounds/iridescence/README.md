# Iridescence

Holographic iridescent color shift using layered CSS gradients, conic rainbow rotation, and fresnel-like edge glow.

## When to use

- Hero sections for creative/design brands
- Product pages with a futuristic, holographic aesthetic
- Sections needing a vibrant, eye-catching background

## Integration

```html
<div class="iri-container">
  <div class="iri-layer iri-base"></div>
  <div class="iri-layer iri-shift"></div>
  <div class="iri-layer iri-rainbow"></div>
  <div class="iri-layer iri-fresnel"></div>
  <div class="iri-noise"></div>
  <div class="iri-content">
    <!-- Your content here -->
  </div>
</div>
```

## Notes

- Four CSS layers create depth: base gradient, shifted gradient, conic rainbow, fresnel edge
- Uses `screen` blend mode for additive color mixing
- Noise texture overlay prevents gradient banding
- Heading text also has a matching iridescent gradient animation
